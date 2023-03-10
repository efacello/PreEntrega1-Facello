const inputPrecio = document.querySelector('#precioDeBase');
let inputIVA = document.querySelector('#IVA');
let inputprecioFinal = document.querySelector('#precioFinal');

function calcular() {
  const precio = Number(inputPrecio.value);
  const IVA = precio * 0.21;
  inputIVA.value = IVA;
  const final= precio + IVA;
  inputprecioFinal.value = final;
}