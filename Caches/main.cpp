#include <iostream>
#include <unordered_map>
#include <list>
#include "Cache.h"
#include <thread>

using namespace std;
int main() {
    srand(time(nullptr)); // Seed the random number generator

    int numSets = 4; // Number of sets in the cache
    int associativity = 2; // Associativity of each set

    SetAssociativeRandom* randomCache = new SetAssociativeRandom(numSets, associativity);

    // Create threads for insertion
    std::thread insertThread([&]() {
        for (int i = 0; i < 10; ++i) {
            randomCache->handler("insert", i % numSets, i);
        }
    });

    // Wait for the insertion thread to finish
    insertThread.join();

    // Print the cache after insertion but before eviction
    cout << "Cache Contents (After Insertion):" << endl;
    randomCache->printCache();

    // Create threads for eviction
    std::thread evictThread([&]() {
        for (int i = 0; i < 10; ++i) {
            randomCache->handler("evict", i % numSets, i);
        }
    });

    // Wait for the eviction thread to finish
    evictThread.join();

    // Print the cache after eviction
    cout << "Cache Contents (After Eviction):" << endl;
    randomCache->printCache();

    // Clean up allocated memory
    delete randomCache;

    return 0;
}
