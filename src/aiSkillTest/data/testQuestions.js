// MCQ Questions
export const mcqQuestions = {
  Beginner: [
    {
      id: 1,
      question: "What is Machine Learning?",
      options: [
        "A type of computer hardware",
        "The ability of computers to learn without explicit programming",
        "A programming language",
        "A database management system"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which of these is a supervised learning task?",
      options: [
        "Clustering customers by purchase behavior",
        "Email spam detection",
        "Anomaly detection in server logs",
        "Dimensionality reduction"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is the purpose of training data in machine learning?",
      options: [
        "To test the model's performance",
        "To teach the model patterns and relationships",
        "To deploy the model",
        "To visualize the results"
      ],
      correctAnswer: 1
    }
  ],
  Intermediate: [
    {
      id: 1,
      question: "What is the difference between bias and variance in machine learning?",
      options: [
        "Bias is underfitting, variance is overfitting",
        "Bias is overfitting, variance is underfitting",
        "They are the same thing",
        "They are unrelated concepts"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which activation function is commonly used in hidden layers of deep neural networks?",
      options: [
        "Sigmoid",
        "ReLU",
        "Softmax",
        "Linear"
      ],
      correctAnswer: 1
    }
  ],
  Advanced: [
    {
      id: 1,
      question: "What is the vanishing gradient problem in deep neural networks?",
      options: [
        "When gradients become too large during backpropagation",
        "When gradients become extremely small in early layers",
        "When the network has too many layers",
        "When the learning rate is too high"
      ],
      correctAnswer: 1
    }
  ]
};

// Coding Challenge Questions
export const codingQuestions = {
  Beginner: [
    {
      id: 1,
      problem: "Create a function that implements a simple linear regression algorithm using gradient descent",
      examples: [
        {
          input: "X = [1, 2, 3], Y = [2, 4, 6]",
          output: "y = 2x + 0"
        }
      ],
      testCases: [
        {
          input: [1, 2, 3],
          expected: [2, 4, 6]
        }
      ]
    },
    {
      id: 2,
      problem: "Implement a function to perform k-means clustering on a 2D dataset",
      examples: [
        {
          input: "points = [[1,1], [2,1], [4,3], [5,4]]",
          output: "clusters = [0, 0, 1, 1]"
        }
      ]
    }
  ],
  Intermediate: [
    {
      id: 1,
      problem: "Implement a simple neural network with one hidden layer using numpy",
      examples: [
        {
          input: "X = [[0,0], [0,1], [1,0], [1,1]], Y = [0, 1, 1, 0]",
          output: "XOR gate implementation"
        }
      ]
    }
  ]
};

// Case Studies
export const caseStudies = {
  Beginner: [
    {
      id: 1,
      title: "Customer Churn Prediction",
      background: "A telecommunications company is experiencing high customer churn rates. They want to predict which customers are likely to leave their service.",
      challenge: "Design a machine learning solution to predict customer churn and propose strategies to retain at-risk customers.",
      requirements: [
        "Identify relevant features for churn prediction",
        "Propose suitable machine learning algorithms",
        "Describe data preprocessing steps",
        "Suggest evaluation metrics",
        "Outline potential business interventions"
      ]
    },
    {
      id: 2,
      title: "E-commerce Product Recommendation",
      background: "An online retailer wants to improve their product recommendation system to increase sales.",
      challenge: "Design a recommendation system that suggests relevant products to users based on their browsing and purchase history.",
      requirements: [
        "Choose appropriate recommendation algorithms",
        "Handle cold-start problems",
        "Consider scalability issues",
        "Propose evaluation metrics"
      ]
    }
  ],
  Intermediate: [
    {
      id: 1,
      title: "Fraud Detection System",
      background: "A financial institution needs to implement real-time fraud detection for credit card transactions.",
      challenge: "Design an ML system that can detect fraudulent transactions in real-time while minimizing false positives.",
      requirements: [
        "Handle class imbalance",
        "Implement real-time processing",
        "Consider cost-sensitive learning",
        "Design monitoring system"
      ]
    }
  ]
};

// Practical Implementation Tasks
export const practicalTasks = {
  Beginner: [
    {
      id: 1,
      title: "Image Classification Model",
      description: "Implement a simple image classification model using a pre-trained neural network",
      requirements: [
        "Use a pre-trained model (e.g., ResNet, VGG)",
        "Implement data loading and preprocessing",
        "Add fine-tuning capabilities",
        "Include evaluation metrics"
      ],
      expectedOutput: "A working image classification model with at least 80% accuracy on the test set"
    },
    {
      id: 2,
      title: "Sentiment Analysis System",
      description: "Build a sentiment analysis system for customer reviews",
      requirements: [
        "Implement text preprocessing",
        "Use appropriate NLP techniques",
        "Train a classification model",
        "Create an evaluation pipeline"
      ],
      expectedOutput: "A sentiment classifier that can categorize reviews as positive, negative, or neutral"
    }
  ],
  Intermediate: [
    {
      id: 1,
      title: "Time Series Forecasting",
      description: "Implement a time series forecasting system for sales prediction",
      requirements: [
        "Handle seasonal patterns",
        "Implement feature engineering",
        "Compare multiple models",
        "Create visualization dashboard"
      ],
      expectedOutput: "A forecasting system that can predict future sales with specified confidence intervals"
    }
  ]
};