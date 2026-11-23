/* =========================================================
   Mikui de la Chagra · Contenido de la página
   Aquí se editan los textos sin tocar el 3D.
   Fuente: Taller 8 – Propuesta Región Amazónica
   ========================================================= */

// Categorías (colores de la leyenda)
export const CAT = {
  chagra:  {txt:'De la chagra',      cls:'b-chagra',   color:'#5b8a43'},
  aporte:  {txt:'Aporte del grupo',  cls:'b-aporte',   color:'#8a5a33'},
  practico:{txt:'Para cocinar',      cls:'b-practico', color:'#d9a62e'},
};

// Ingredientes: el orden define el número y la posición en el 3D.
// El "id" debe coincidir con una función en main.js (BUILD).
export const INGS = [
  {id:'yuca',   name:'Yuca',           cat:'chagra',  qty:'500 g',        qtyNote:'cocida y triturada',
   role:'Es la base de la tortica. Cocida y triturada le da el cuerpo a toda la masa.',
   note:'Se siembra en las chagras y es uno de los alimentos más importantes de la región.'},
  {id:'platano',name:'Plátano maduro', cat:'chagra',  qty:'1',            qtyNote:'unidad mediana',
   role:'Le da el sabor dulce y una textura suave a la mezcla.',
   note:'También se cultiva en las chagras, junto a la yuca.'},
  {id:'huevo',  name:'Huevo',          cat:'aporte',  qty:'1',            qtyNote:'unidad',
   role:'Ayuda a unir la mezcla para que la tortica no se desarme al dorarla.',
   allergen:true},
  {id:'fecula', name:'Fécula de maíz', cat:'aporte',  qty:'2',            qtyNote:'cucharadas',
   role:'Le da firmeza a la masa para poder moldearla. Si queda muy húmeda, se le agrega un poco más.'},
  {id:'sal',    name:'Sal',            cat:'practico',qty:'Al gusto',     qtyNote:'',
   role:'Para ajustar el sabor de la mezcla.'},
  {id:'aceite', name:'Aceite',         cat:'practico',qty:'Un poquito',   qtyNote:'para engrasar',
   role:'Solo para engrasar la sartén o la bandeja y que queden doradas por ambos lados.'},
];

// Pestañas del panel cuando no hay ingrediente seleccionado
export const TABS = {
  producto: `
    <h2>La tortica</h2>
    <p>Torticas pequeñas y doradas de yuca y plátano maduro, de unos 4 a 5 cm. Se comen de un bocado, sin cubiertos.</p>
    <p>Desármala para ver qué lleva y por qué escogimos cada ingrediente.</p>
    <div class="facts"><span>4–5 cm</span><span>12–15 por tanda</span><span>Sartén u horno</span><span class="alerta">Contiene huevo</span></div>`,
  prep: `
    <h2>Cómo se hace</h2>
    <ol class="steps">
      <li>Cocinar la yuca pelada hasta que esté blanda y quitarle la fibra del centro.</li>
      <li>Cocinar el plátano maduro hasta que esté suave y escurrir.</li>
      <li>Triturar ambos hasta tener una mezcla uniforme.</li>
      <li>Agregar huevo, fécula y sal, y mezclar hasta poder moldear.</li>
      <li>Formar torticas delgadas y dorarlas por ambos lados.</li>
    </ol>`,
  chagra: `
    <h2>¿Qué es la chagra?</h2>
    <p>Es el espacio de cultivo familiar donde se siembran alimentos como la yuca y el plátano. No es solo de donde sale la comida: también es territorio, trabajo en familia y saberes que pasan de generación en generación.</p>
    <p class="note">No es una receta ancestral ni de un pueblo específico. Es una reinterpretación nuestra que reconoce de dónde viene la inspiración.</p>`
};
