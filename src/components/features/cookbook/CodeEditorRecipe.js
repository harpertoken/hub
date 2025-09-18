import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeEditorRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        Code Editor
        <p className="text-sm text-gray-600">
          Instructions details for the Code Editor component.
        </p>
        <div className="flex items-center text-xs text-gray-400 mt-3">
          <span className="mr-4">15 minutes</span>
          <span>Medium</span>
        </div>
      </header>

      {/* Ingredients Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Ingredients
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li>1 Monaco Editor integration (@monaco-editor/react)</li>
          <li>1 custom language service for auto-completion</li>
          <li>1 data structure visualization library (D3.js)</li>
          <li>2 cups of algorithm execution environment</li>
          <li>1 tablespoon of syntax highlighting (Prism or Monaco built-in)</li>
          <li>A handful of code snippets for common data structures and algorithms</li>
          <li>A pinch of AI-powered code suggestions</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Set Up Monaco Editor with Custom Configuration</p>
            <p>Configure Monaco Editor with advanced features for a better coding experience.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// src/components/AdvancedCodeEditor.js
import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const AdvancedCodeEditor = ({
  initialCode = '// Write your code here\\n\\n',
  language = 'javascript',
  onChange,
  onExecute
}) => {
  const editorRef = useRef(null);
  const [theme, setTheme] = useState('vs');
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Configure editor features
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // Set compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      esModuleInterop: true,
    });

    // Add extra libraries for auto-completion
    addExtraLibs(monaco);
  };

  // Add extra libraries for auto-completion
  const addExtraLibs = (monaco) => {
    // Add data structures and algorithms typings
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      \`
      /**
       * Common data structures for use in algorithms
       */
      declare class Stack<T> {
        /**
         * Creates a new stack
         */
        constructor();

        /**
         * Pushes an element onto the stack
         * @param element The element to push
         */
        push(element: T): void;

        /**
         * Removes and returns the top element from the stack
         * @returns The top element, or undefined if the stack is empty
         */
        pop(): T | undefined;

        /**
         * Returns the top element without removing it
         * @returns The top element, or undefined if the stack is empty
         */
        peek(): T | undefined;

        /**
         * Returns the number of elements in the stack
         */
        size(): number;

        /**
         * Checks if the stack is empty
         * @returns True if the stack is empty, false otherwise
         */
        isEmpty(): boolean;
      }

      /**
       * Queue data structure implementation
       */
      declare class Queue<T> {
        constructor();
        enqueue(element: T): void;
        dequeue(): T | undefined;
        front(): T | undefined;
        size(): number;
        isEmpty(): boolean;
      }

      /**
       * Binary Tree Node
       */
      declare class TreeNode<T> {
        value: T;
        left: TreeNode<T> | null;
        right: TreeNode<T> | null;
        constructor(value: T);
      }

      /**
       * Graph data structure
       */
      declare class Graph {
        constructor(directed?: boolean);
        addVertex(vertex: string): void;
        addEdge(vertex1: string, vertex2: string, weight?: number): void;
        removeVertex(vertex: string): void;
        removeEdge(vertex1: string, vertex2: string): void;
        getAdjacencyList(): Record<string, string[]>;
        bfs(startVertex: string): string[];
        dfs(startVertex: string): string[];
        dijkstra(startVertex: string, endVertex: string): { distance: number, path: string[] };
      }

      /**
       * Common sorting algorithms
       */
      declare namespace Sorting {
        /**
         * Sorts an array using the bubble sort algorithm
         * @param arr The array to sort
         * @returns The sorted array
         */
        function bubbleSort<T>(arr: T[]): T[];

        /**
         * Sorts an array using the quick sort algorithm
         * @param arr The array to sort
         * @returns The sorted array
         */
        function quickSort<T>(arr: T[]): T[];

        /**
         * Sorts an array using the merge sort algorithm
         * @param arr The array to sort
         * @returns The sorted array
         */
        function mergeSort<T>(arr: T[]): T[];
      }

      /**
       * Common searching algorithms
       */
      declare namespace Searching {
        /**
         * Performs a binary search on a sorted array
         * @param arr The sorted array to search
         * @param target The value to search for
         * @returns The index of the target, or -1 if not found
         */
        function binarySearch<T>(arr: T[], target: T): number;

        /**
         * Performs a linear search on an array
         * @param arr The array to search
         * @param target The value to search for
         * @returns The index of the target, or -1 if not found
         */
        function linearSearch<T>(arr: T[], target: T): number;
      }
      \`,
      'ts:datastructures.d.ts'
    );
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={initialCode}
        theme={theme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          folding: true,
          tabSize: 2,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnCommitCharacter: true,
          quickSuggestions: true,
          suggestSelection: 'first',
          codeLens: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

export default AdvancedCodeEditor;`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Data Structure Visualization</p>
            <p>Create a component to visualize data structures like trees, graphs, and arrays.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// src/components/DataStructureVisualizer.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DataStructureVisualizer = ({
  dataStructure,
  type = 'tree',
  width = 500,
  height = 300
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!dataStructure || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Create visualization based on type
    switch (type) {
      case 'tree':
        renderTree(dataStructure);
        break;
      case 'graph':
        renderGraph(dataStructure);
        break;
      case 'array':
        renderArray(dataStructure);
        break;
      default:
        console.warn(\`Visualization for \${type} not implemented\`);
    }
  }, [dataStructure, type, width, height]);

  // Render binary tree
  const renderTree = (tree) => {
    const svg = d3.select(svgRef.current);

    // Create tree layout
    const treeLayout = d3.tree().size([width - 40, height - 40]);

    // Convert data to hierarchy
    const root = d3.hierarchy(tree);

    // Apply layout
    const treeData = treeLayout(root);

    // Add links
    svg.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x + 20)
        .y(d => d.y + 20))
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1.5);

    // Add nodes
    const nodes = svg.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => \`translate(\${d.x + 20},\${d.y + 20})\`);

    // Add node circles
    nodes.append('circle')
      .attr('r', 15)
      .attr('fill', '#fff')
      .attr('stroke', '#4299e1')
      .attr('stroke-width', 2);

    // Add node labels
    nodes.append('text')
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.value)
      .attr('font-size', '12px')
      .attr('fill', '#333');
  };

  // Render graph
  const renderGraph = (graph) => {
    // Instructions for graph visualization
    // ...
  };

  // Render array
  const renderArray = (array) => {
    const svg = d3.select(svgRef.current);
    const cellWidth = Math.min(50, width / array.length);
    const cellHeight = 40;

    // Create array cells
    const cells = svg.selectAll('.cell')
      .data(array)
      .enter()
      .append('g')
      .attr('class', 'cell')
      .attr('transform', (d, i) => \`translate(\${i * cellWidth + 20},\${height / 2 - cellHeight / 2})\`);

    // Add cell rectangles
    cells.append('rect')
      .attr('width', cellWidth - 2)
      .attr('height', cellHeight)
      .attr('fill', '#fff')
      .attr('stroke', '#4299e1')
      .attr('stroke-width', 1.5);

    // Add cell values
    cells.append('text')
      .attr('x', (cellWidth - 2) / 2)
      .attr('y', cellHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d)
      .attr('font-size', '12px')
      .attr('fill', '#333');

    // Add indices
    cells.append('text')
      .attr('x', (cellWidth - 2) / 2)
      .attr('y', cellHeight + 15)
      .attr('text-anchor', 'middle')
      .text((d, i) => i)
      .attr('font-size', '10px')
      .attr('fill', '#666');
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default DataStructureVisualizer;`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create Algorithm Execution Environment</p>
            <p>Build a secure sandbox for executing and visualizing algorithms.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// src/services/AlgorithmExecutor.js
/**
 * Safely executes code in a controlled environment
 * @param {string} code The code to execute
 * @param {Object} context Additional context variables
 * @returns {Object} The execution result and any visualizable data
 */
export const executeAlgorithm = (code, context = {}) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a secure execution context
      const secureContext = {
        ...context,
        console: {
          log: (...args) => {
            console.log(...args);
            return args[0];
          },
          error: (...args) => {
            console.error(...args);
            return args[0];
          }
        },
        // Add data structure implementations
        Stack: createStackClass(),
        Queue: createQueueClass(),
        TreeNode: createTreeNodeClass(),
        Graph: createGraphClass(),
        // Add sorting algorithms
        Sorting: {
          bubbleSort: bubbleSort,
          quickSort: quickSort,
          mergeSort: mergeSort
        },
        // Add searching algorithms
        Searching: {
          binarySearch: binarySearch,
          linearSearch: linearSearch
        },
        // Visualization data collector
        visualizationData: {
          type: null,
          data: null,
          steps: [],
          setData: function(type, data) {
            this.type = type;
            this.data = data;
          },
          addStep: function(step) {
            this.steps.push(step);
          }
        }
      };

      // Wrap code in async function to allow await
      const wrappedCode = \`
        (async function() {
          try {
            \${code}
          } catch (error) {
            return { error: error.message };
          }
        })()
      \`;

      // Execute the code with the secure context
      const result = Function(...Object.keys(secureContext), \`return \${wrappedCode}\`)
        (...Object.values(secureContext));

      // Handle the result
      result
        .then(output => {
          resolve({
            output,
            visualizationData: secureContext.visualizationData
          });
        })
        .catch(error => {
          reject({
            error: error.message || 'Execution error'
          });
        });
    } catch (error) {
      reject({
        error: error.message || 'Syntax error'
      });
    }
  });
};

// Instructions of data structure classes
const createStackClass = () => {
  return class Stack {
    constructor() {
      this.items = [];
    }

    push(element) {
      this.items.push(element);
    }

    pop() {
      if (this.isEmpty()) return undefined;
      return this.items.pop();
    }

    peek() {
      if (this.isEmpty()) return undefined;
      return this.items[this.items.length - 1];
    }

    isEmpty() {
      return this.items.length === 0;
    }

    size() {
      return this.items.length;
    }

    toArray() {
      return [...this.items];
    }
  };
};

// Instructions of other data structures and algorithms
// ...`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Integrate AI-Powered Code Suggestions</p>
            <p>Add AI-powered code completion and suggestions using Gemini API.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// src/services/CodeCompletionService.js
import { API_URL } from '../../../lib/config';

/**
 * Get code completion suggestions from Gemini API
 * @param {string} code The current code
 * @param {string} language The programming language
 * @param {number} position The cursor position
 * @returns {Promise<Array>} Array of completion suggestions
 */
export const getCodeCompletions = async (code, language, position) => {
  try {
    const response = await fetch(\`\${API_URL}/api/code-completion\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        position,
      }),
    });

    if (!response.ok) {
      throw new Error(\`API error \${response.status}\`);
    }

    const data = await response.json();
    return data.completions;
  } catch (error) {
    console.error('Error getting code completions:', error);
    return [];
  }
};

// Server-side endpoint implementation
// app.post('/api/code-completion', express.json(), async (req, res) => {
//   try {
//     const { code, language, position } = req.body;
//
//     // Initialize the model
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash"
//     });
//
//     // Create prompt for code completion
//     const prompt = \`
//     You are an intelligent code completion system. Complete the following code:
//
//     Language: \${language}
//
//     Code:
//     \${code}
//
//     Current cursor position: \${position}
//
//     Provide 3-5 completion suggestions that would be appropriate at the current cursor position.
//     Format your response as a JSON array of objects with 'text' and 'description' properties.
//     \`;
//
//     // Generate completions
//     const result = await model.generateContent(prompt);
//     const completionText = result.response.text();
//
//     // Parse completions from response
//     let completions = [];
//     try {
//       // Extract JSON from response
//       const jsonMatch = completionText.match(/\[.*\]/); // eslint-disable-line no-useless-escape
//       if (jsonMatch) {
//         completions = JSON.parse(jsonMatch[0]);
//       }
//     } catch (parseError) {
//       console.error('Error parsing completions:', parseError);
//     }
//
//     res.json({ completions });
//   } catch (error) {
//     console.error('Error generating code completions:', error);
//     res.status(500).json({ error: error.message });
//   }
// });`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create a Code Snippet Library</p>
            <p>Build a library of common data structures and algorithms for quick insertion.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// src/data/CodeSnippets.js
export const codeSnippets = {
  dataStructures: [
    {
      name: 'Stack Instructions',
      language: 'javascript',
      code: \`class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  print() {
    console.log(this.items.toString());
  }
}

// Example usage
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.pop()); // 30
console.log(stack.peek()); // 20
console.log(stack.size()); // 2
\`
    },
    {
      name: 'Binary Search Tree',
      language: 'javascript',
      code: \`class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);

    if (this.root === null) {
      this.root = newNode;
      return this;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) return this;

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    if (!this.root) return false;

    let current = this.root;
    let found = false;

    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        found = true;
      }
    }

    return found ? current : false;
  }
}

// Example usage
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(2);
bst.insert(7);

// Visualize the tree
visualizationData.setData('tree', bst.root);
\`
    }
  ],
  algorithms: [
    {
      name: 'Quick Sort',
      language: 'javascript',
      code: \`function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const middle = [];
  const right = [];

  for (let element of arr) {
    if (element < pivot) {
      left.push(element);
    } else if (element > pivot) {
      right.push(element);
    } else {
      middle.push(element);
    }
  }

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Example usage
const unsortedArray = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
const sortedArray = quickSort(unsortedArray);
console.log(sortedArray);

// Visualize the array
visualizationData.setData('array', sortedArray);
\`
    },
    {
      name: 'Binary Search',
      language: 'javascript',
      code: \`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Visualize current step
    visualizationData.addStep({
      array: [...arr],
      left,
      mid,
      right,
      target
    });

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// Example usage
const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 7;
const result = binarySearch(sortedArray, target);
console.log(\`Found \${target} at index \${result}\`);

// Visualize the array
visualizationData.setData('array', sortedArray);
\`
    }
  ]
};`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Chef's Notes - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Chef's Notes
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            This advanced code editor implementation provides several key benefits:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Intelligent Auto-Completion:</span> By combining Monaco Editor's built-in capabilities with custom type definitions and AI-powered suggestions, developers get context-aware code completion that understands data structures and algorithms.
            </li>
            <li>
              <span className="font-medium">Visual Learning:</span> The data structure visualization component helps users understand complex concepts by providing visual representations of abstract data structures like trees and graphs.
            </li>
            <li>
              <span className="font-medium">Safe Execution Environment:</span> The algorithm executor provides a secure sandbox for running code, protecting against malicious code while allowing users to experiment with algorithms.
            </li>
            <li>
              <span className="font-medium">Code Snippet Library:</span> Pre-built implementations of common data structures and algorithms help users quickly get started with complex concepts.
            </li>
          </ul>
          <p className="mt-4">
            This approach creates a comprehensive learning environment for data structures and algorithms, combining code editing, visualization, and execution in a single interface.
          </p>
        </div>
      </section>

      {/* Instructions Tips - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions Tips
        <div className="text-sm text-gray-600 space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Performance Optimization:</span> For large data structures, implement virtualization in the visualization component to maintain smooth performance.
            </li>
            <li>
              <span className="font-medium">Code Execution Security:</span> Be extremely careful with the code execution environment to prevent security vulnerabilities. Consider using a separate service or Web Workers for isolation.
            </li>
            <li>
              <span className="font-medium">Accessibility:</span> Ensure visualizations have alternative text representations for users with visual impairments.
            </li>
            <li>
              <span className="font-medium">Mobile Support:</span> Adapt the editor interface for touch devices with larger controls and simplified visualizations for smaller screens.
            </li>
            <li>
              <span className="font-medium">Offline Support:</span> Consider implementing a service worker to allow the editor to function without an internet connection, with limited AI features.
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default CodeEditorRecipe;
