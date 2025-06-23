import { ProblemConfig, Language } from '@/types'

export const recursionProblems: Record<string, ProblemConfig> = {
  factorial: {
    id: 'factorial',
    title: 'Factorial Calculation',
    description: 'Calculate the factorial of a number using recursion. The factorial of n (written as n!) is the product of all positive integers less than or equal to n.',
    complexity: 'Beginner',
    concepts: ['Base case', 'Recursive case', 'Mathematical induction'],
    codeExamples: {
      javascript: {
        language: 'javascript',
        code: `function factorial(n) {
  // Base case: factorial of 0 or 1 is 1
  if (n <= 1) {
    return 1;
  }
  
  // Recursive case: n * factorial(n-1)
  return n * factorial(n - 1);
}

// Example usage
console.log(factorial(5)); // Output: 120`,
        explanation: 'JavaScript implementation using simple function syntax with clear base and recursive cases.'
      },
      typescript: {
        language: 'typescript',
        code: `function factorial(n: number): number {
  // Base case: factorial of 0 or 1 is 1
  if (n <= 1) {
    return 1;
  }
  
  // Recursive case: n * factorial(n-1)
  return n * factorial(n - 1);
}

// Example usage
console.log(factorial(5)); // Output: 120`,
        explanation: 'TypeScript implementation with type annotations for better type safety and IDE support.'
      },
      python: {
        language: 'python',
        code: `def factorial(n):
    """Calculate factorial using recursion"""
    # Base case: factorial of 0 or 1 is 1
    if n <= 1:
        return 1
    
    # Recursive case: n * factorial(n-1)
    return n * factorial(n - 1)

# Example usage
print(factorial(5))  # Output: 120`,
        explanation: 'Python implementation with docstring and clean syntax following Python conventions.'
      },
      java: {
        language: 'java',
        code: `public class Factorial {
    public static int factorial(int n) {
        // Base case: factorial of 0 or 1 is 1
        if (n <= 1) {
            return 1;
        }
        
        // Recursive case: n * factorial(n-1)
        return n * factorial(n - 1);
    }
    
    public static void main(String[] args) {
        System.out.println(factorial(5)); // Output: 120
    }
}`,
        explanation: 'Java implementation using static method with proper class structure and main method for testing.'
      },
      cpp: {
        language: 'cpp',
        code: `#include <iostream>
using namespace std;

int factorial(int n) {
    // Base case: factorial of 0 or 1 is 1
    if (n <= 1) {
        return 1;
    }
    
    // Recursive case: n * factorial(n-1)
    return n * factorial(n - 1);
}

int main() {
    cout << factorial(5) << endl; // Output: 120
    return 0;
}`,
        explanation: 'C++ implementation with iostream for output and standard function structure.'
      }
    },
    visualizationSteps: [
      {
        id: 'step1',
        description: 'Initial call: factorial(5)',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 5 },
        explanation: 'We start by calling factorial(5). The function receives n=5 as parameter.'
      },
      {
        id: 'step2',
        description: 'Check base case: n > 1, so continue to recursive case',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: true,
          line: 2
        }],
        currentLine: 2,
        variables: { n: 5 },
        explanation: 'We check if n <= 1. Since 5 > 1, we proceed to the recursive case.'
      },
      {
        id: 'step3',
        description: 'Recursive call: factorial(4)',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 4 },
        explanation: 'We make a recursive call with factorial(4). This creates a new stack frame.'
      },
      {
        id: 'step4',
        description: 'Check base case: factorial(4), n > 1',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: true,
          line: 2
        }],
        currentLine: 2,
        variables: { n: 4 },
        explanation: 'Check base case for factorial(4). Since 4 > 1, continue to recursive case.'
      },
      {
        id: 'step5',
        description: 'Recursive call: factorial(3)',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'call3',
          functionName: 'factorial',
          parameters: { n: 3 },
          depth: 2,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 3 },
        explanation: 'Make recursive call factorial(3). Stack grows deeper.'
      },
      {
        id: 'step6',
        description: 'Check base case: factorial(3), n > 1',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'call3',
          functionName: 'factorial',
          parameters: { n: 3 },
          depth: 2,
          isActive: true,
          line: 2
        }],
        currentLine: 2,
        variables: { n: 3 },
        explanation: 'Check base case for factorial(3). Since 3 > 1, continue to recursive case.'
      },
      {
        id: 'step7',
        description: 'Recursive call: factorial(2)',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'call3',
          functionName: 'factorial',
          parameters: { n: 3 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'call4',
          functionName: 'factorial',
          parameters: { n: 2 },
          depth: 3,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 2 },
        explanation: 'Make recursive call factorial(2). Maximum stack depth reached.'
      },
      {
        id: 'step8',
        description: 'Check base case: factorial(2), n > 1',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'call3',
          functionName: 'factorial',
          parameters: { n: 3 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'call4',
          functionName: 'factorial',
          parameters: { n: 2 },
          depth: 3,
          isActive: true,
          line: 2
        }],
        currentLine: 2,
        variables: { n: 2 },
        explanation: 'Check base case for factorial(2). Since 2 > 1, continue to recursive case.'
      },
      {
        id: 'step9',
        description: 'Recursive call: factorial(1)',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'call3',
          functionName: 'factorial',
          parameters: { n: 3 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'call4',
          functionName: 'factorial',
          parameters: { n: 2 },
          depth: 3,
          isActive: false,
          line: 6
        }, {
          id: 'call5',
          functionName: 'factorial',
          parameters: { n: 1 },
          depth: 4,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 1 },
        explanation: 'Make final recursive call factorial(1). This will hit the base case.'
      },
      {
        id: 'step10',
        description: 'Base case reached: factorial(1) = 1',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'call3',
          functionName: 'factorial',
          parameters: { n: 3 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'call4',
          functionName: 'factorial',
          parameters: { n: 2 },
          depth: 3,
          isActive: false,
          line: 6
        }, {
          id: 'call5',
          functionName: 'factorial',
          parameters: { n: 1 },
          depth: 4,
          isActive: true,
          line: 3,
          returnValue: 1
        }],
        currentLine: 3,
        variables: { n: 1 },
        explanation: 'Base case reached! factorial(1) returns 1. Now we start unwinding the call stack.'
      },
      {
        id: 'step11',
        description: 'Return to factorial(2): 2 * 1 = 2',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'call3',
          functionName: 'factorial',
          parameters: { n: 3 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'call4',
          functionName: 'factorial',
          parameters: { n: 2 },
          depth: 3,
          isActive: true,
          line: 6,
          returnValue: 2
        }],
        currentLine: 6,
        variables: { n: 2 },
        explanation: 'Back in factorial(2). Calculate 2 * factorial(1) = 2 * 1 = 2. Return 2.'
      },
      {
        id: 'step12',
        description: 'Return to factorial(3): 3 * 2 = 6',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'call3',
          functionName: 'factorial',
          parameters: { n: 3 },
          depth: 2,
          isActive: true,
          line: 6,
          returnValue: 6
        }],
        currentLine: 6,
        variables: { n: 3 },
        explanation: 'Back in factorial(3). Calculate 3 * factorial(2) = 3 * 2 = 6. Return 6.'
      },
      {
        id: 'step13',
        description: 'Return to factorial(4): 4 * 6 = 24',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'call2',
          functionName: 'factorial',
          parameters: { n: 4 },
          depth: 1,
          isActive: true,
          line: 6,
          returnValue: 24
        }],
        currentLine: 6,
        variables: { n: 4 },
        explanation: 'Back in factorial(4). Calculate 4 * factorial(3) = 4 * 6 = 24. Return 24.'
      },
      {
        id: 'step14',
        description: 'Final result: factorial(5) = 5 * 24 = 120',
        callStack: [{
          id: 'call1',
          functionName: 'factorial',
          parameters: { n: 5 },
          depth: 0,
          isActive: true,
          line: 6,
          returnValue: 120
        }],
        currentLine: 6,
        variables: { n: 5 },
        explanation: 'Back in original factorial(5). Calculate 5 * factorial(4) = 5 * 24 = 120. Final result!'
      }
    ]
  },
  
  fibonacci: {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate Fibonacci numbers using recursion. Each number is the sum of the two preceding ones, starting from 0 and 1.',
    complexity: 'Intermediate',
    concepts: ['Multiple recursive calls', 'Tree recursion', 'Exponential time complexity'],
    codeExamples: {
      javascript: {
        language: 'javascript',
        code: `function fibonacci(n) {
  // Base cases
  if (n <= 1) {
    return n;
  }
  
  // Recursive case: fibonacci(n-1) + fibonacci(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(6)); // Output: 8`,
        explanation: 'JavaScript implementation showing tree recursion with two recursive calls per function call.'
      },
      typescript: {
        language: 'typescript',
        code: `function fibonacci(n: number): number {
  // Base cases
  if (n <= 1) {
    return n;
  }
  
  // Recursive case: fibonacci(n-1) + fibonacci(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(6)); // Output: 8`,
        explanation: 'TypeScript version with type safety, demonstrating the classic recursive Fibonacci approach.'
      },
      python: {
        language: 'python',
        code: `def fibonacci(n):
    """Generate nth Fibonacci number using recursion"""
    # Base cases
    if n <= 1:
        return n
    
    # Recursive case: fibonacci(n-1) + fibonacci(n-2)
    return fibonacci(n - 1) + fibonacci(n - 2)

# Example usage
print(fibonacci(6))  # Output: 8`,
        explanation: 'Python implementation with clear base cases and recursive structure for educational purposes.'
      },
      java: {
        language: 'java',
        code: `public class Fibonacci {
    public static int fibonacci(int n) {
        // Base cases
        if (n <= 1) {
            return n;
        }
        
        // Recursive case: fibonacci(n-1) + fibonacci(n-2)
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(6)); // Output: 8
    }
}`,
        explanation: 'Java implementation showcasing the exponential time complexity of naive recursive Fibonacci.'
      },
      cpp: {
        language: 'cpp',
        code: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    // Base cases
    if (n <= 1) {
        return n;
    }
    
    // Recursive case: fibonacci(n-1) + fibonacci(n-2)
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << fibonacci(6) << endl; // Output: 8
    return 0;
}`,
        explanation: 'C++ implementation demonstrating the tree-like recursive call pattern of Fibonacci.'
      }
    },
    visualizationSteps: [
      {
        id: 'fib_step1',
        description: 'Initial call: fibonacci(4)',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 4 },
        explanation: 'We start by calling fibonacci(4). This will branch into two recursive calls.'
      },
      {
        id: 'fib_step2',
        description: 'Check base case: fibonacci(4), n > 1',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: true,
          line: 2
        }],
        currentLine: 2,
        variables: { n: 4 },
        explanation: 'Check base case for fibonacci(4). Since 4 > 1, we proceed to recursive calls.'
      },
      {
        id: 'fib_step3',
        description: 'First recursive call: fibonacci(3)',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call2',
          functionName: 'fibonacci',
          parameters: { n: 3 },
          depth: 1,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 3 },
        explanation: 'Make first recursive call fibonacci(3). This creates a new stack frame.'
      },
      {
        id: 'fib_step4',
        description: 'Check base case: fibonacci(3), n > 1',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call2',
          functionName: 'fibonacci',
          parameters: { n: 3 },
          depth: 1,
          isActive: true,
          line: 2
        }],
        currentLine: 2,
        variables: { n: 3 },
        explanation: 'Check base case for fibonacci(3). Since 3 > 1, continue to recursive calls.'
      },
      {
        id: 'fib_step5',
        description: 'Recursive call: fibonacci(2)',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call2',
          functionName: 'fibonacci',
          parameters: { n: 3 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call3',
          functionName: 'fibonacci',
          parameters: { n: 2 },
          depth: 2,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 2 },
        explanation: 'Call fibonacci(2) from fibonacci(3). Stack grows deeper.'
      },
      {
        id: 'fib_step6',
        description: 'fibonacci(2): Call fibonacci(1)',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call2',
          functionName: 'fibonacci',
          parameters: { n: 3 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call3',
          functionName: 'fibonacci',
          parameters: { n: 2 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call4',
          functionName: 'fibonacci',
          parameters: { n: 1 },
          depth: 3,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 1 },
        explanation: 'From fibonacci(2), call fibonacci(1). This will hit base case.'
      },
      {
        id: 'fib_step7',
        description: 'Base case: fibonacci(1) = 1',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call2',
          functionName: 'fibonacci',
          parameters: { n: 3 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call3',
          functionName: 'fibonacci',
          parameters: { n: 2 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call4',
          functionName: 'fibonacci',
          parameters: { n: 1 },
          depth: 3,
          isActive: true,
          line: 3,
          returnValue: 1
        }],
        currentLine: 3,
        variables: { n: 1 },
        explanation: 'Base case reached! fibonacci(1) returns 1.'
      },
      {
        id: 'fib_step8',
        description: 'fibonacci(2): Call fibonacci(0)',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call2',
          functionName: 'fibonacci',
          parameters: { n: 3 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call3',
          functionName: 'fibonacci',
          parameters: { n: 2 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call5',
          functionName: 'fibonacci',
          parameters: { n: 0 },
          depth: 3,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 0 },
        explanation: 'From fibonacci(2), now call fibonacci(0) for the second part of the sum.'
      },
      {
        id: 'fib_step9',
        description: 'Base case: fibonacci(0) = 0',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call2',
          functionName: 'fibonacci',
          parameters: { n: 3 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call3',
          functionName: 'fibonacci',
          parameters: { n: 2 },
          depth: 2,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call5',
          functionName: 'fibonacci',
          parameters: { n: 0 },
          depth: 3,
          isActive: true,
          line: 3,
          returnValue: 0
        }],
        currentLine: 3,
        variables: { n: 0 },
        explanation: 'Base case reached! fibonacci(0) returns 0.'
      },
      {
        id: 'fib_step10',
        description: 'Complete fibonacci(2): 1 + 0 = 1',
        callStack: [{
          id: 'fib_call1',
          functionName: 'fibonacci',
          parameters: { n: 4 },
          depth: 0,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call2',
          functionName: 'fibonacci',
          parameters: { n: 3 },
          depth: 1,
          isActive: false,
          line: 6
        }, {
          id: 'fib_call3',
          functionName: 'fibonacci',
          parameters: { n: 2 },
          depth: 2,
          isActive: true,
          line: 6,
          returnValue: 1
        }],
        currentLine: 6,
        variables: { n: 2 },
        explanation: 'Back in fibonacci(2). Calculate fibonacci(1) + fibonacci(0) = 1 + 0 = 1. Return 1.'
      }
    ]
  },
  
  hanoi: {
    id: 'hanoi',
    title: 'Tower of Hanoi',
    description: 'Solve the classic Tower of Hanoi puzzle using recursion. Move all disks from source to destination using an auxiliary rod.',
    complexity: 'Advanced',
    concepts: ['Divide and conquer', 'Recursive problem decomposition', 'State management'],
    codeExamples: {
      javascript: {
        language: 'javascript',
        code: `function hanoi(n, source, destination, auxiliary) {
  // Base case: only one disk
  if (n === 1) {
    console.log(\`Move disk 1 from \${source} to \${destination}\`);
    return;
  }
  
  // Step 1: Move n-1 disks to auxiliary
  hanoi(n - 1, source, auxiliary, destination);
  
  // Step 2: Move the largest disk to destination
  console.log(\`Move disk \${n} from \${source} to \${destination}\`);
  
  // Step 3: Move n-1 disks from auxiliary to destination
  hanoi(n - 1, auxiliary, destination, source);
}

// Example usage
hanoi(3, 'A', 'C', 'B');`,
        explanation: 'JavaScript implementation breaking down the complex problem into smaller subproblems.'
      },
      typescript: {
        language: 'typescript',
        code: `function hanoi(n: number, source: string, destination: string, auxiliary: string): void {
  // Base case: only one disk
  if (n === 1) {
    console.log(\`Move disk 1 from \${source} to \${destination}\`);
    return;
  }
  
  // Step 1: Move n-1 disks to auxiliary
  hanoi(n - 1, source, auxiliary, destination);
  
  // Step 2: Move the largest disk to destination
  console.log(\`Move disk \${n} from \${source} to \${destination}\`);
  
  // Step 3: Move n-1 disks from auxiliary to destination
  hanoi(n - 1, auxiliary, destination, source);
}

// Example usage
hanoi(3, 'A', 'C', 'B');`,
        explanation: 'TypeScript version with type annotations for parameters and return type.'
      },
      python: {
        language: 'python',
        code: `def hanoi(n, source, destination, auxiliary):
    """Solve Tower of Hanoi puzzle recursively"""
    # Base case: only one disk
    if n == 1:
        print(f"Move disk 1 from {source} to {destination}")
        return
    
    # Step 1: Move n-1 disks to auxiliary
    hanoi(n - 1, source, auxiliary, destination)
    
    # Step 2: Move the largest disk to destination
    print(f"Move disk {n} from {source} to {destination}")
    
    # Step 3: Move n-1 disks from auxiliary to destination
    hanoi(n - 1, auxiliary, destination, source)

# Example usage
hanoi(3, 'A', 'C', 'B')`,
        explanation: 'Python implementation using f-strings and clear parameter naming for readability.'
      },
      java: {
        language: 'java',
        code: `public class TowerOfHanoi {
    public static void hanoi(int n, String source, String destination, String auxiliary) {
        // Base case: only one disk
        if (n == 1) {
            System.out.println(&quot;Move disk 1 from &quot; + source + &quot; to &quot; + destination);
            return;
        }
        
        // Step 1: Move n-1 disks to auxiliary
        hanoi(n - 1, source, auxiliary, destination);
        
        // Step 2: Move the largest disk to destination
        System.out.println(&quot;Move disk &quot; + n + &quot; from &quot; + source + &quot; to &quot; + destination);
        
        // Step 3: Move n-1 disks from auxiliary to destination
        hanoi(n - 1, auxiliary, destination, source);
    }
    
    public static void main(String[] args) {
        hanoi(3, "A", "C", "B");
    }
}`,
        explanation: 'Java implementation with proper class structure and string concatenation for output.'
      },
      cpp: {
        language: 'cpp',
        code: `#include <iostream>
#include <string>
using namespace std;

void hanoi(int n, string source, string destination, string auxiliary) {
    // Base case: only one disk
    if (n == 1) {
        cout << "Move disk 1 from " << source << " to " << destination << endl;
        return;
    }
    
    // Step 1: Move n-1 disks to auxiliary
    hanoi(n - 1, source, auxiliary, destination);
    
    // Step 2: Move the largest disk to destination
    cout << "Move disk " << n << " from " << source << " to " << destination << endl;
    
    // Step 3: Move n-1 disks from auxiliary to destination
    hanoi(n - 1, auxiliary, destination, source);
}

int main() {
    hanoi(3, "A", "C", "B");
    return 0;
}`,
        explanation: 'C++ implementation using string parameters and iostream for formatted output.'
      }
    },
    visualizationSteps: [
      {
        id: 'hanoi_step1',
        description: 'Initial call: hanoi(3, A, C, B)',
        callStack: [{
          id: 'hanoi_call1',
          functionName: 'hanoi',
          parameters: { n: 3, source: 'A', destination: 'C', auxiliary: 'B' },
          depth: 0,
          isActive: true,
          line: 1
        }],
        currentLine: 1,
        variables: { n: 3, source: 'A', destination: 'C', auxiliary: 'B' },
        explanation: 'We start by trying to move 3 disks from tower A to tower C using B as auxiliary.'
      }
    ]
  }
} 