class RecintosZoo {
    constructor() {
      // Parte que defini os recintos dos animais
      this.recintos = [
        { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
        { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
        { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
        { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
        { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
      ];
  
      // Defini animais e suas características
      this.animais = {
        LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
        LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
        CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
        MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
        GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
        HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
      };
    }
  
    // Função principal que analisa os recintos viáveis
    analisaRecintos(especie, quantidade) {
      // Verificar se o animal informado é válido
      if (!this.animais[especie.toUpperCase()]) {
        return { erro: "Animal inválido" };
      }
  
      // Verificar se a quantidade é válida
      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return { erro: "Quantidade inválida" };
      }
  
      // Filtrar e mapear recintos viáveis
      const recintosViaveis = this.recintos
        .filter(recinto => this.eRecintoViavel(recinto, especie.toUpperCase(), quantidade))
        .map(recinto => {
          const espacoOcupado = this.getEspacoOcupado(recinto, especie.toUpperCase(), quantidade);
          const espacoLivre = recinto.tamanho - espacoOcupado;
          return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
        });
  
      // Se não houver recintos viáveis
      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável" };
      }
  
      return { recintosViaveis };
    }
  
    // Função para verificar se um recinto é viável para o novo animal
    eRecintoViavel(recinto, novaEspecie, quantidade) {
      const animal = this.animais[novaEspecie];
      const biomaAdequado = animal.bioma.includes(recinto.bioma) || recinto.bioma === 'savana e rio';
      if (!biomaAdequado) return false;
  
      const espacoOcupado = this.getEspacoOcupado(recinto, novaEspecie, quantidade);
      if (espacoOcupado > recinto.tamanho) return false;
  
      if (animal.carnivoro && recinto.animais.length > 0 && recinto.animais[0].especie !== novaEspecie) {
        return false;
      }
  
      if (novaEspecie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animais.length > 0) {
        return false;
      }
  
      if (novaEspecie === 'MACACO' && recinto.animais.length === 0 && quantidade === 1) {
        return false;
      }
  
      if (recinto.animais.some(animalExistente => this.animais[animalExistente.especie].carnivoro)) {
        return false;
      }
  
      return true;
    }
  
    // Função para calcular o espaço ocupado no recinto
    getEspacoOcupado(recinto, novaEspecie, quantidade) {
      let espacoOcupado = recinto.animais.reduce((total, animal) => total + this.animais[animal.especie].tamanho * animal.quantidade, 0);
      espacoOcupado += this.animais[novaEspecie].tamanho * quantidade;
  
      if (recinto.animais.length > 0 && recinto.animais[0].especie !== novaEspecie) {
        espacoOcupado += 1; // Espaço extra para múltiplas espécies
      }
  
      return espacoOcupado;
    }
  }

export { RecintosZoo as RecintosZoo };

const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos('MACACO', 2)); // Caso válido
console.log(zoo.analisaRecintos('UNICORNIO', 1)) // Caso inválido 