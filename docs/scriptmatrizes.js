function metodoPotencia() {
    var inputMatrix = document.getElementById('matrix').value;
    var matrix = parseMatrix(inputMatrix);

    var maxIterations = 1000;
    var precisao = parseFloat(document.getElementById("precisao").value);

    // Inicialização do vetor estimado
    var n = matrix.length;
    var initialVector = [];
    for (var i = 0; i < n; i++) {
        initialVector.push(1);
    }

    var processo = document.getElementById("processo");
    processo.innerHTML = "";

    // inicializacao
    var eigenvalue = 0;
    var eigenvector = initialVector;

    for (var iteration = 0; iteration < maxIterations; iteration++) {

        var passo = document.createElement("li");
        passo.className = "passo";
        
        // copiar valores
        var oldEigenvalue = eigenvalue;
        var oldEigenvector = eigenvector;
        passo.appendChild(createVectorElem(oldEigenvector));
        passo.appendChild(createTextElem("p", "norm→", "vert seta"));

        // normalizar
        var oldX1 = scalarMultiply(oldEigenvector, 1 / vectorNorm(oldEigenvector));
        passo.appendChild(createVectorElem(oldX1));
        passo.appendChild(createTextElem("p", "mult→", "vert seta"));

        // calcular vetor nao normalizado
        eigenvector = matrixVectorMultiply(matrix, oldX1);
        passo.appendChild(createVectorElem(eigenvector));
        passo.appendChild(createTextElem("p", "→", "vert seta"));

        // calcular nova estimativa do autovalor
        eigenvalue = dotProduct(oldX1, eigenvector);
        passo.appendChild(createTextElem("p", eigenvalue, "vert autovalor"));

        processo.appendChild(passo);

        // checar convergencia
        if (Math.abs((eigenvalue-oldEigenvalue)/eigenvalue) <= precisao) { 
            eigenvector = oldX1;
            break;
        }
        
    }

    // Exibição do resultado
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "<strong>Autovalor:</strong> " + eigenvalue.toFixed(4) + "<br><strong>Autovetor:</strong> [ " + eigenvector.join(", ") + " ]";
}

function metodoPotenciaInversa() {
    var inputMatrix = document.getElementById('matrix').value;
    var matrix = parseMatrix(inputMatrix);

    var maxIterations = 1000;
    var precisao = parseFloat(document.getElementById("precisao").value);

    // Inicialização do vetor estimado
    var n = matrix.length;
    var initialVector = [];
    for (var i = 0; i < n; i++) {
        initialVector.push(1);
    }

    var processo = document.getElementById("processo");
    processo.innerHTML = "";

    var {L, U} = decomposeLU(matrix);
    console.log("LU:", L, U);
}

function parseMatrix(inputMatrix) {
    var rows = inputMatrix.trim().split("\n");
    var matrix = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i].trim().split(/\s+/);
        matrix.push(row.map(Number));
    }
    return matrix;
}

// matrix * vetor
function matrixVectorMultiply(matrix, vector) {
    var result = [];
    for (var i = 0; i < matrix.length; i++) {
        var row = matrix[i];
        var sum = 0;
        for (var j = 0; j < row.length; j++) {
            sum += row[j] * vector[j];
        }
        result.push(sum);
    }
    return result;
}

// multiplicacao dos elementos do vetor por um escalar
function scalarMultiply(vector, scalar) {
    return vector.map(function (x) {
        return x * scalar;
    });
}

// somar o quadrado dos valores do vetor e retornar sua raiz
function vectorNorm(vector) {
    var sumOfSquares = vector.reduce(function (sum, x) {
        return sum + (x * x);
    }, 0);
    return Math.sqrt(sumOfSquares);
}

// produto escalar de vetores
function dotProduct(vector1, vector2) {
    var product = 0;
    for (var i = 0; i < vector1.length; i++) {
        product += vector1[i] * vector2[i];
    }
    return product;
}

// decomposicao LU
function decomposeLU(matrix) {

    function subtraiLinha(matrix, linharecebe, linhasub, valor) {
        for (let x = 0; x < matrix.length; ++x) {
            matrix[linharecebe][x] -= valor*matrix[linhasub][x];
        }
        return matrix;
    }

    const n = matrix.length;
    var L = [];
    var U = matrix;
  
    // Inicializa as matrizes L com zeros
    for (let i = 0; i < n; i++) {
        L[i] = [];
        for (let j = 0; j < n; j++) L[i][j] = 0;
        L[i][i] = 1;
    }
  
    for (let i = 0; i < n; ++i) {
        for (let k = i+1; k < n; ++ k) {
            const Uki = U[k][i]; // salvar antes de zerar
            U = subtraiLinha(U, k, i, U[k][i]/U[i][i]);
            L[k][i] = Uki/U[i][i];
        }
    }
    
    return { L, U };
}

// funcoes p/ html
function createMatrixElem(matrix) {
    var tableElem = document.createElement("table");
    for (var i = 0; i < matrix.length; i++) {
        var rowElem = document.createElement("tr");

        for (var j = 0; j < matrix[i].length; j++) {
            var cellElem = document.createElement("td");
            cellElem.textContent = matrix[i][j];
            rowElem.appendChild(cellElem);
        }
        
        tableElem.appendChild(rowElem);
    }
    return tableElem;
}

function createVectorElem(vector) {

    var ulElem = document.createElement("ul");
    ulElem.className = "vetor";

    for (var i = 0; i < vector.length; i++) {
        var liElem = document.createElement("li");
        liElem.textContent = vector[i];
        ulElem.appendChild(liElem);
    }

    return ulElem;
}

function createTextElem(tag, text, classe) {
    var div = document.createElement("div");
    div.className = classe;
    var elem = document.createElement(tag);
    elem.innerText = text;
    div.appendChild(elem);

    return div;
}

function botaoHandler() {

    // limpando o que tinha antes
    const elem1 = document.getElementById("result");
    const elem2 = document.getElementById("processo");
    elem1.innerHTML = "";
    elem2.innerHTML = "";

    const selecionado = document.getElementById("opcoes").value;

    let metodo;

    switch (selecionado) {
        case "metodopotencia":
            metodoPotencia();
            break;
        case "metodopotenciainversa":
            metodoPotenciaInversa();
            break;
        default:
            break;
    }
}