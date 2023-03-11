<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora</title>
</head>

<body>
    <h1>Pseudo Calculadora</h1>

    <input type="text" id="n1" placeholder="Ingrese un número">
    <input type="text" id="n2" placeholder="Ingrese un número">
    <select id="op">
        <option value="+">Suma</option>
        <option value="-">Resta</option>
        <option value="*">Multiplicación</option>
        <option value="/">División</option>
    </select>
    <button id="calcular">Calcular</button>
    <script>
        document.querySelector('#calcular').addEventListener('click', () =>{
            const n1 = parseInt(document.querySelector('#n1').value);
            const n2 = parseInt(document.querySelector('#n2').value);
            const op = document.querySelector('#op').value;
            let r;

            if (op == '+'){
                r = n1 + n2;
            } else if (op == '-'){
                r = n1 - n2;
            } else if (op == '*'){
                r = n1 * n2;
            } else if (op == '/'){
                r = n1 / n2;
            }
            console.log(r)
        });
    </script>
    
    <script src="./js/main.js"></script>
</body>
</html>
