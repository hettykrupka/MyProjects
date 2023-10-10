#include <iostream>

using namespace std;


class Node { 
    public: 
        int value;
        Node* left;
        Node* right;

        Node(int value) {
            this->value = value;
            left = nullptr;
            right = nullptr;
        }
};


class BinarySearchTree {
    public:
        Node* root;

    public:
        BinarySearchTree() { root = nullptr; }


        // ---------------------------------------------------
        //  Below is a helper function used by the destructor
        //  Deletes all nodes in BST
        //  Similar to DFS PostOrder in Tree Traversal section
        // ---------------------------------------------------
        void destroy(Node* currentNode) {
            if (currentNode->left) destroy(currentNode->left);
            if (currentNode->right) destroy(currentNode->right);
            delete currentNode;
        }

        ~BinarySearchTree() { destroy(root); }
 
        bool insert(int new_value)
        {
            if (root == nullptr)
            {
                root = new Node(new_value);
                return true;
            }
            else 
            {
                Node *node = root;
                while (node)
                {
                    if (node->value == new_value)
                    {
                        return false;
                    }
                    else if (node->value > new_value)
                    {
                        if (node->left == nullptr)
                        {
                            node->left = new Node(new_value);
                            return true;
                        }
                        else 
                        {
                            node = node->left;
                        }
                    }
                    else if (node->value < new_value)
                    {
                        if (node->right == nullptr)
                        {
                            node->right = new Node(new_value);
                            return true;
                        }
                        else 
                        {
                            node = node->left;
                        }
                    }
                }
                return false;
            }
        }
        
};



int main() {
        
    BinarySearchTree* myBST = new BinarySearchTree();

    myBST->insert(2);
    myBST->insert(1);
    myBST->insert(3);

    /*
        THE LINES ABOVE CREATE THIS TREE:
                     2
                    / \
                   1   3
    */
        
                  

    // ROOT MUST BE PUBLIC FOR THESE LINES TO WORK
    cout << "Root: " << myBST->root->value;
    cout << "\n\nRoot->Left: " << myBST->root->left->value;
    cout << "\n\nRoot->Right: " << myBST->root->right->value;


    /*
        EXPECTED OUTPUT:
        ----------------
        Root: 2

        Root->Left: 1

        Root->Right: 3

    */

}
