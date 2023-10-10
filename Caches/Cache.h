#include <iostream>
#include <map>
#include <vector>
#include <ctime>
#include <cstdlib>

using namespace std;

class Cache {
protected:
    map<int, list<int>> cacheSets; // Map of sets, where the key is the set index, and the value is a vector of cache lines
    int associativity;
    std::mutex mtx; 

public:
    virtual void handler(string operation, int setIndex, int data) = 0;

    void printCache() {
        cout << "Cache Contents:" << endl;
        for (const auto& pair : cacheSets) {
            int setIndex = pair.first;
            cout << "Set " << setIndex << ": ";
            for (int data : pair.second) {
                cout << data << " ";
            }
            cout << endl;
        }
    }
};

class SetAssociativeLRU : public Cache {
public:
    SetAssociativeLRU(int numSets, int associativity) {

        //Initialise set size
        this->associativity = associativity;

        // Initialize the cache with empty sets of the specified size
        for (int i = 0; i < numSets; ++i) {
            cacheSets[i] = list<int>(associativity, -1); // Initialize with -1 indicating empty cache lines
        }
    }

    void handler(string operation, int setIndex, int data )
    {
        std::unique_lock<std::mutex> lock(mtx);
        insert(setIndex, data);
    }
private: 
    void insert(int setIndex, int data) {

        list<int>& set = cacheSets[setIndex];

        // Check if the data is already in the set (for LRU purposes)
        auto it = find(set.begin(), set.end(), data);

        if (it != set.end()) 
        {
            // Data is already in the set, move it to the front to mark it as most recently used
            set.erase(it);
            set.push_front(data);
        } 
        else 
        {
            // Data is not in the set
            if (set.size() >= associativity) {
                // If the set is full, evict the LRU item (the back of the list)
                set.pop_back();
            }
            // Insert the new data at the front to mark it as most recently used
            set.push_front(data);
        }
    }
};

class SetAssociativeFIFO : public Cache {
public:
    SetAssociativeFIFO(int numSets, int associativity) {
        //Initialise set size
        this->associativity = associativity;
        
        // Initialize the cache with empty sets of the specified size
        for (int i = 0; i < numSets; ++i) {
            cacheSets[i] = list<int>(associativity, -1); // Initialize with -1 indicating empty cache lines
        }
    }

    void handler(string operation, int setIndex, int data )
    {
        std::unique_lock<std::mutex> lock(mtx);

        if (operation == "insert")
        {
            insert(setIndex, data);
        }
        else if (operation == "evict")
        {
            evict(setIndex);
        }

    }

private: 
    void insert(int setIndex, int data) {
        list<int>& set = cacheSets[setIndex];

        if (set.size() >= associativity) {
            // If the set is full, evict the first item (FIFO)
            set.pop_front();
        }
        // Insert the new data at the end to maintain FIFO order
        set.push_back(data);
    }

    int evict(int setIndex) {
        list<int>& set = cacheSets[setIndex];
        if (!set.empty()) {
            // Evict the first item (FIFO)
            int evictedData = set.front();
            set.pop_front();
            return evictedData;
        } else {
            // Handle the case where the set is already empty
            return -1; // You can return a special value to indicate an empty eviction
        }
    }
};

class SetAssociativeRandom : public Cache {
public:
    SetAssociativeRandom(int numSets, int associativity) {
        //Initialise set size
        this->associativity = associativity;

        // Initialize the cache with empty sets of the specified size
        for (int i = 0; i < numSets; ++i) {
            cacheSets[i] = list<int>(associativity, -1); // Initialize with -1 indicating empty cache lines
        }
    }
    
    void handler(string operation, int setIndex, int data )
    {
        std::unique_lock<std::mutex> lock(mtx);

        if (operation == "insert")
        {
            insert(setIndex, data);
        }
        else if (operation == "evict")
        {
            evict(setIndex);
        }
    }

private:
    void insert(int setIndex, int data) {
        list<int>& set = cacheSets[setIndex];

        if (set.size() >= associativity) {
            // If the set is full, evict a randomly chosen item
            int randomIndex = rand() % associativity;
            auto it = set.begin();
            advance(it, randomIndex);
            set.erase(it);
        }
        // Insert the new data at the end
        set.push_back(data);
    }

    int evict(int setIndex) {
        list<int>& set = cacheSets[setIndex];

        if (!set.empty()) {
            // Evict a randomly chosen item
            int randomIndex = rand() % set.size();
            auto it = set.begin();
            advance(it, randomIndex);
            int evictedData = *it;
            set.erase(it);
            return evictedData;
        } else {
            // Handle the case where the set is already empty
            return -1; // You can return a special value to indicate an empty eviction
        }
    }
};

class SetAssociativeLFU : public Cache {
private:
    map<int, int> accessCount; // Map to keep track of access counts for cache lines

public:
    SetAssociativeLFU(int numSets, int associativity) {
        //Initialise set size
        this->associativity = associativity;

        // Initialize the cache with empty sets of the specified size
        for (int i = 0; i < numSets; ++i) {
            cacheSets[i] = list<int>(associativity, -1); // Initialize with -1 indicating empty cache lines
        }
    }

    void handler(string operation, int setIndex, int data )
    {
        std::unique_lock<std::mutex> lock(mtx);

        if (operation == "insert")
        {
            insert(setIndex, data);
        }
        else if (operation == "evict")
        {
            evict(setIndex);
        }

    }

private:
    void insert(int setIndex, int data) {
        list<int>& set = cacheSets[setIndex];

        if (set.size() >= associativity) {
            // If the set is full, evict the item with the lowest access count (LFU)
            int minCount = INT_MAX;
            auto minCountIter = set.begin();
            for (auto it = set.begin(); it != set.end(); ++it) {
                int line = *it;
                if (accessCount[line] < minCount) {
                    minCount = accessCount[line];
                    minCountIter = it;
                }
            }
            set.erase(minCountIter);
        }
        // Insert the new data at the end
        set.push_back(data);
        // Initialize the access count for the new data
        accessCount[data] = 1;
    }

    int evict(int setIndex) {
        list<int>& set = cacheSets[setIndex];

        if (!set.empty()) {
            // Evict the item with the lowest access count (LFU)
            int minCount = INT_MAX;
            auto evictedDataIter = set.begin();
            for (auto it = set.begin(); it != set.end(); ++it) {
                int line = *it;
                if (accessCount[line] < minCount) {
                    minCount = accessCount[line];
                    evictedDataIter = it;
                }
            }
            int evictedData = *evictedDataIter;
            set.erase(evictedDataIter);
            // Remove the access count entry for the evicted item
            accessCount.erase(evictedData);
            return evictedData;
        } else {
            // Handle the case where the set is already empty
            return -1; // You can return a special value to indicate an empty eviction
        }
    }
};


/*
=== Least Recently Used (LRU) ===
Pros:
LRU is conceptually simple and often provides good cache performance for a wide range of access patterns.
It takes into account the temporal locality principle, where recently accessed items are more likely to be accessed again.
Cons:
Implementation can be complex and computationally expensive as it requires maintaining a history of cache line accesses.
LRU may not perform well for access patterns that exhibit "hot" and "cold" spots because it does not consider the actual frequency of access, only the recency.

=== FIFO (First-In-First-Out) ===
Pros:
FIFO is easy to implement and requires less bookkeeping compared to LRU.
It is a simple algorithm that guarantees that the oldest cache line in the set is replaced, which can be beneficial for some specific access patterns.
Cons:
FIFO may not perform well when there are varying levels of access frequency among items in the cache because it doesn't take access recency into account.
It can suffer from the "Belady's Anomaly," where increasing cache size may not necessarily improve performance.

=== Random Replacement ===
Pros:
Random replacement is extremely simple to implement and does not require any additional bookkeeping for tracking access history.
In some cases, random replacement can exhibit surprising effectiveness for certain access patterns, particularly when the access pattern is not easily predictable.
Cons:
Random replacement does not consider the actual access history or recency of cache line accesses, making it inefficient for many real-world scenarios.
Performance is highly variable and unpredictable; it does not exploit the principle of temporal locality.

=== Least Frequently Used (LFU) ===
Pros:
LFU aims to replace the least frequently accessed cache line, which can be effective for certain access patterns that exhibit skewed access frequencies.
Cons:
Implementation can be complex and computationally expensive, as it requires maintaining a counter for each cache line to track access frequency.
LFU may not work well in cases where access frequencies change dynamically, and the counters become outdated.

*/
