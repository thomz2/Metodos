function Integral(a,b,funcao,estimativa,precisao){
    let N=1, Aold = 0, erro = 1;
    while(erro > precisao){
        N *= 2;
        var A = 0;
        let Dx = (b-a)/N;
        for(let k=0;k<N;k++){
            const xi = a + Dx*k;
            const xf = a + Dx*(k+1);
            A += estimativa(funcao, xi, xf);
        }
        erro = Math.abs((A-Aold)/A);
        Aold = A;
    }
    return {valor:A, erro: erro, divisoes: N};
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

    let f;

    switch (selecionado) {
        case "trapeziofechada":
            f = trapezioFechada;
            break;
        case "trapezioaberta":
            f = trapezioAberta;
            break;
        case "grau2fechada":
            f = grau2Fechada;
            break;
        case "grau2aberta":
            f = grau2Aberta;
            break;
        case "grau3fechada":
            f = grau3Fechada;
            break;
        case "grau3aberta":
            f = grau3Aberta;
            break;
        case "grau4fechada":
            f = grau4Fechada;
            break;
        case "grau4aberta":
            f = grau4Aberta;
            break;
    
        default:
            break;
    }

    const funcao = eval("x => " + "{ return " + textfuncao.value + "}");

    const result = Integral(a, b, funcao, f, precisao);

    const textresposta = document.getElementById("resultado");
    textresposta.value = 'valor: ' + result.valor + '\nerro: ' + result.erro + '\ndivisoes:' + result.divisoes;

    console.log(result.valor);
    

}
