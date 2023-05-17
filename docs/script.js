function Integral(xi,xf,funcao,estimador,precisao){
    let N=1, Aold = 0, erro = 1;
    while(erro > precisao){
        N *= 2;
        var A = 0;
        let Dx = (xf-xi)/N;
        for(let k=0;k<N;k++){
            const a = xi + Dx*k;
            const b = xi + Dx*(k+1);
            A += estimador(funcao, a, b);
        }
        erro = Math.abs((A-Aold)/A);
        Aold = A;
    }
    return {valor:A, erro: erro, divisoes: N};
}

function EstimadorLegendre(data){

    const raizes = data.raizes;
    const pesos  = data.pesos;

    let legendre = function(funcao,a,b){

        let x = (s) => (a+b)/2 + s*(b-a)/2;

        const valores = raizes.map((raiz, i) => funcao(x(raiz))*pesos[i]);

        const soma = valores.reduce((pi,p)=> pi+p, 0);

        return soma*(b-a)/2;
    }

    legendre.grau = raizes.length;

    return legendre;
}

function trapezioFechada(funcao, a, b){
    let deltax = b-a;
    return (funcao(a) + funcao(b))*deltax/2;
}

function grau2Fechada(funcao, a, b){
    let deltax = b-a, h = deltax/2;
    const x = (s) => a + s*h;
    return (h/3)*(funcao(x(0)) + 4*funcao(x(1)) + funcao(x(2)));
}

function grau3Fechada(funcao, a, b){
    let deltax = b-a, h = deltax/3;
    const x = (s) => a + s*h;
    return (3*h/8)*(funcao(x(0)) + 3*funcao(x(1)) + 3*funcao(x(2)) + funcao(x(3)));
}

function grau4Fechada(funcao, a, b){
    let deltax = b-a, h = deltax/4;
    const x = (s) => a + s*h;
    return (deltax/90)*(7*funcao(x(0)) + 32*funcao(x(1)) + 12*funcao(x(2)) + 32*funcao(x(3)) + 7*funcao(x(4)));
}

function trapezioAberta(funcao, a, b){
    let deltax = b-a, h = deltax/3;
    const x = (s) => a + h + s*h;
    return (funcao(x(0)) + funcao(x(1)))*deltax/2;
}

function grau2Aberta(funcao, a, b){
    let deltax = b-a, h = deltax/4;
    const x = (s) => a + h + s*h;
    return ((2*funcao(x(0)) - funcao(x(1)) + 2*funcao(x(2)))*h*4)/3;
}

function grau3Aberta(funcao, a, b){
    let deltax = b-a, h = deltax/5;
    const x = (s) => a + h + s*h;
    return ((11*funcao(x(0)) + funcao(x(1)) + funcao(x(2)) + 11*funcao(x(3)))*h*5)/24;
}

function grau4Aberta(funcao, a, b){
    let deltax = b-a, h = deltax/6;
    const x = (s) => a + s*h + h;
    return (h/10)*(33*funcao(x(0)) - 42*funcao(x(1)) + 78*funcao(x(2)) - 42*funcao(x(3)) + 33*funcao(x(4)));
    // tirei o h/10 e botei h/100
}

function botaoHandler() {

    const selecionado = document.getElementById("opcoes").value;
    console.log(selecionado);
    const textfuncao = document.getElementById("funcao");
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const precisao = parseFloat(document.getElementById("precisao").value);

    let estimador;

    switch (selecionado) {
        case "trapeziofechada":
            estimador = trapezioFechada;
            break;
        case "trapezioaberta":
            estimador = trapezioAberta;
            break;
        case "grau2fechada":
            estimador = grau2Fechada;
            break;
        case "grau2aberta":
            estimador = grau2Aberta;
            break;
        case "grau3fechada":
            estimador = grau3Fechada;
            break;
        case "grau3aberta":
            estimador = grau3Aberta;
            break;
        case "grau4fechada":
            estimador = grau4Fechada;
            break;
        case "grau4aberta":
            estimador = grau4Aberta;
            break;
        case "legendre segundo grau":
            estimador = EstimadorLegendre({
                                            raizes:[Math.sqrt(1/3), -Math.sqrt(1/3)], 
                                            pesos: [1,1]
                                         });
            break;

        case "legendre quarto grau":
            estimador = EstimadorLegendre({
                                            raizes:[-0.8611363116,  -0.3399810436,  0.3399810436,  0.8611363116], 
                                            pesos: [ 0.3478548451, 0.6521451549, 0.6521451549 ,  0.3478548451]
                                            });
            break;
        default:
            break;
    }

    const funcao = eval("x => " + "{ return " + textfuncao.value + "}");

    const result = Integral(a, b, funcao, estimador, precisao);

    const textresposta = document.getElementById("resultado");
    textresposta.value = 'valor: ' + result.valor + '\nerro: ' + result.erro + '\ndivisoes:' + result.divisoes;

    console.log(result.valor);
    

}