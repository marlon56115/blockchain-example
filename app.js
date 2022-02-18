const SHA256 = require("crypto-js/sha256");
let sistema = {
  blockChain: [],
  dificultad: "00",
  crearGenesis: function () {
    let genesis = this.crearBloque("Bloque de Genesis", "");
    genesis.hash = this.crearHash(genesis);
    this.blockChain.push(genesis);
  },
  crearHash: function (bloque) {
    return SHA256(
      bloque.index +
      bloque.fecha +
      JSON.stringify(bloque.datos) +
      bloque.previousHash +
      bloque.nons
    ).toString()
  },
  crearBloque: function (data, previous) {
    let bloque = {
      index: this.blockChain.length + 1,
      fecha: new Date(),
      previousHash: previous,
      hash: '',
      datos: data,
      nonce: 0
    }
    return bloque
  },
  agregarBloque: function (datos) {
    console.log("agregando bloque")
    let previo = this.blockChain[this.blockChain.length - 1];
    let block = this.crearBloque(datos, previo.hash);
    //minado
    block=this.minarBloque(block);
    this.blockChain.push(block); 
  },

  minarBloque: function (bloque) {
    while (!bloque.hash.startsWith(this.dificultad)) {
      console.log("no");
      bloque.nons++;
      bloque.hash = this.crearHash(bloque);
    }
  },

  validarCadena: function () {
    for (let i = 1;i<this.blockChain.length; i++){
      let previBlock = this.blockChain[i - 1];
      let currBlock = this.blockChain[i];
      //primera validacion
      if (currBlock.previousHash != previBlock.hash) {
        console.log("error de hash previo" + currBlock.index);
        return false;
      }
      if (this.crearHash(currBlock) != currBlock.hash) {
        console.log("el hash no es correcto");
        return false;
      }
      return true;
    }
  }
};

sistema.crearGenesis();
sistema.agregarBloque({ 'voto': 'a' });
sistema.agregarBloque({ 'voto': 'b' });
console.log(sistema.validarCadena());

//ataque
sistema.blockChain[1].datos.voto = "w";
console.log(sistema.validarCadena());


console.log(JSON.stringify(sistema.blockChain), null, 2);