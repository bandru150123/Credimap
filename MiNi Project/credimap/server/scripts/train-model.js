const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');

// Configuration
const MAX_WORDS = 1000;
const MAX_SEQ_LEN = 50;
const EMBEDDING_DIM = 16;

// Skills to learn
const SKILLS = [
    // Programming Languages
    "python", "java", "javascript", "typescript", "c", "c++", "c#", "go", "rust",
    "kotlin", "swift", "php", "ruby", "scala", "matlab", "r", "dart", "bash", "powershell",
    "perl", "haskell", "clojure", "elixir", "erlang", "lua", "julia", "objective-c", "fortran", "assembly", "solidity",
    // Frontend
    "html", "css", "sass", "tailwind", "bootstrap", "react", "angular", "vue",
    "nextjs", "nuxtjs", "redux", "webpack", "vite", "threejs", "d3js", "ui ux", "figma", "adobe xd",
    "svelte", "emberjs", "backbonejs", "material ui", "ant design", "chakra ui", "styled components", "framer motion", "gsap", "sketch", "invision", "zeplin",
    // Backend
    "node", "express", "django", "flask", "spring boot", "laravel", "asp.net",
    "fastapi", "graphql", "rest api", "microservices", "authentication", "jwt",
    "nest js", "koa", "meteor", "ruby on rails", "phoenix", "grpc", "soap", "websocket", "webrtc", "websockets", "oauth", "saml", "sso", "redis", "memcached", "rabbitmq", "kafka", "celery",
    // Databases
    "mongodb", "mysql", "postgresql", "sqlite", "redis", "cassandra", "firebase",
    "dynamodb", "neo4j", "elasticsearch", "mariadb", "oracle", "sql server", "db2", "couchbase", "couchdb", "influxdb", "timescaledb", "hadoop", "spark", "hive", "presto", "snowflake", "bigquery", "redshift", "supabase", "prisma", "typeorm", "mongoose", "sequelize", "hibernate",
    // Cloud and DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible",
    "jenkins", "github actions", "ci cd", "nginx", "linux", "bash scripting",
    "circleci", "travis ci", "gitlab ci", "argo cd", "pulumi", "chef", "puppet", "vagrant", "packer", "promotheus", "grafana", "datadog", "new relic", "splunk", "elk stack", "logstash", "kibana", "fluentd", "istio", "envoy", "helm", "serverless", "lambda", "cloudfront", "route53", "s3", "ec2", "ecs", "eks", "fargate", "vpc", "iam", "cloudwatch", "cloudformation", "elastic beanstalk", "azure devops", "azure functions", "acr", "aks", "app service", "cosmos db", "cloud run", "app engine", "gke", "pub sub", "cloud storage",
    // Data Science and AI
    "machine learning", "deep learning", "nlp", "computer vision", "data analysis",
    "pandas", "numpy", "scikit learn", "tensorflow", "pytorch", "keras",
    "matplotlib", "seaborn", "opencv", "scipy", "statsmodels", "huggingface", "transformers", "spacy", "nltk", "gensim", "xgboost", "lightgbm", "catboost", "prophet", "arima", "mlflow", "kubeflow", "jupyter", "colab", "databricks", "sagemaker", "vertex ai", "azure ml", "generative ai", "llm", "langchain", "llama", "chatgpt", "openai", "stable diffusion", "midjourney", "prompt engineering", "data engineering", "data warehouse", "data lake", "etl", "elt", "airflow", "luigi", "dbt", "kafka streams", "flink", "storm", "tableau", "power bi", "looker",
    // Mobile
    "android", "ios", "react native", "flutter", "xamarin", "swift ui",
    "ionic", "cordova", "capacitor", "objective c", "jetpack compose", "expo",
    // Testing
    "unit testing", "integration testing", "selenium", "jest", "mocha", "pytest", "cypress",
    "puppeteer", "playwright", "jasmine", "karma", "chai", "enzyme", "testing library", "rspec", "cucumber", "appium", "katalon", "postman", "soapui", "jmeter", "loadrunner", "gatling", "locust",
    // Tools and Collaboration
    "git", "github", "gitlab", "bitbucket", "jira", "trello", "slack", "notion", "agile", "scrum",
    "kanban", "confluence", "asana", "monday.com", "microsoft teams", "zoom", "google workspace", "office 365", "vscode", "intellij", "pycharm", "eclipse", "webstorm", "visual studio", "xcode", "android studio", "vim", "emacs", "nano", "tmux"
];

// 1. Preprocessing Helper
const tokenize = (text) => {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 1);
};

// 2. Generate Synthetic Training Data
const generateData = () => {
    const trainingData = [];
    const labels = [];

    const templates = [
        "Certificate of Completion in {skill}",
        "This certifies that {name} has completed {skill} training",
        "Awarded for excellence in {skill} development",
        "Verified {skill} developer certification",
        "Expertise in {skill} and related technologies",
        "Successful completion of {skill} bootcamp",
        "Professional certification: {skill} engineer"
    ];

    SKILLS.forEach((skill, index) => {
        for (let i = 0; i < 20; i++) {
            const template = templates[Math.floor(Math.random() * templates.length)];
            const text = template.replace('{skill}', skill).replace('{name}', 'Student');
            trainingData.push(text);

            const label = new Array(SKILLS.length).fill(0);
            label[index] = 1;
            labels.push(label);
        }
    });

    return { trainingData, labels };
};

// 3. Build Vocabulary
const createVocab = (texts) => {
    const wordCounts = {};
    texts.forEach(text => {
        tokenize(text).forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
    });

    const vocab = { "<PAD>": 0, "<OOV>": 1 };
    Object.keys(wordCounts)
        .sort((a, b) => wordCounts[b] - wordCounts[a])
        .slice(0, MAX_WORDS - 2)
        .forEach((word, i) => vocab[word] = i + 2);

    return vocab;
};

// 4. Transform to Tensors
const textsToTensors = (texts, vocab) => {
    return texts.map(text => {
        const tokens = tokenize(text);
        const sequence = tokens.map(token => vocab[token] || 1);

        // Pad or Truncate
        if (sequence.length > MAX_SEQ_LEN) {
            return sequence.slice(0, MAX_SEQ_LEN);
        } else {
            return [...sequence, ...new Array(MAX_SEQ_LEN - sequence.length).fill(0)];
        }
    });
};

async function train() {
    console.log("Generating data...");
    const { trainingData, labels } = generateData();
    const vocab = createVocab(trainingData);

    // Save vocab for inference
    const servicesPath = path.join(__dirname, '../services');
    if (!fs.existsSync(servicesPath)) fs.mkdirSync(servicesPath, { recursive: true });
    fs.writeFileSync(path.join(servicesPath, 'vocab.json'), JSON.stringify(vocab));
    console.log("Vocab saved.");

    const xData = textsToTensors(trainingData, vocab);
    const xTrain = tf.tensor2d(xData);
    const yTrain = tf.tensor2d(labels);

    console.log("Building 1D CNN Model...");
    const model = tf.sequential();

    model.add(tf.layers.embedding({
        inputDim: MAX_WORDS,
        outputDim: EMBEDDING_DIM,
        inputLength: MAX_SEQ_LEN
    }));

    model.add(tf.layers.conv1d({
        kernelSize: 3,
        filters: 4,
        activation: 'relu'
    }));

    model.add(tf.layers.globalMaxPooling1d());

    model.add(tf.layers.dense({
        units: SKILLS.length,
        activation: 'sigmoid'
    }));

    model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    console.log("Training (3 epochs)...");
    await model.fit(xTrain, yTrain, {
        epochs: 3,
        batchSize: 16,
        shuffle: true,
        verbose: 0
    });

    console.log("Saving model manually...");
    const modelPath = path.join(servicesPath, 'model');
    if (!fs.existsSync(modelPath)) fs.mkdirSync(modelPath, { recursive: true });

    try {
        // Force the save handler to run and capture artifacts
        let capturedArtifacts;
        await model.save({
            save: async (artifacts) => {
                capturedArtifacts = artifacts;
                return { modelArtifactsInfo: { dateSaved: new Date(), modelTopologyType: 'JSON' } };
            }
        });

        if (capturedArtifacts) {
            console.log("Artifacts captured, writing files...");
            const modelJSON = {
                modelTopology: capturedArtifacts.modelTopology,
                format: "layers-model",
                generatedBy: "TensorFlow.js v" + tf.version.tfjs,
                convertedBy: null,
                weightsManifest: [{
                    paths: ['./weights.bin'],
                    weights: capturedArtifacts.weightSpecs
                }]
            };

            fs.writeFileSync(path.join(modelPath, 'model.json'), JSON.stringify(modelJSON, null, 2));
            fs.writeFileSync(path.join(modelPath, 'weights.bin'), Buffer.from(capturedArtifacts.weightData));
            console.log(`Model files written to ${modelPath}`);
        } else {
            console.error("Failed to capture model artifacts!");
        }
    } catch (saveErr) {
        console.error("Error during manual save:", saveErr);
    }

    console.log("Training session finished.");

    xTrain.dispose();
    yTrain.dispose();
}

train().catch(console.error);
