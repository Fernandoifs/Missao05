class Repository {
    execute(query) {
      return [
        { id: 1, empresa: 'Empresa A', data_inicio: '2024-01-01', data_final: '2024-02-01' },
        { id: 2, empresa: 'Empresa B', data_inicio: '2024-02-01', data_final: '2024-03-01' },
        { id: 3, empresa: 'Empresa C', data_inicio: '2024-01-01', data_final: '2024-01-30' }
      ];
    }
  }
  
  function getContracts(empresa, inicio) {
    const repo = new Repository();
  
    let query = 'SELECT * FROM contracts WHERE true';
    const params = [];
  
    if (empresa) {
      query += ' AND empresa = ?';
      params.push(empresa);
    }
    if (inicio) {
      query += ' AND data_inicio = ?';
      params.push(inicio);
    }
  
    const allContracts = repo.execute(query);
  
    let filtered = allContracts;
  
    if (params.length > 0) {
      filtered = allContracts.filter(contract => {
        if (empresa && contract.empresa !== empresa) {
          return false;
        }
        if (inicio && contract.data_inicio !== inicio) {
          return false;
        }
        return true;
      });
    }
  
    return filtered;
  }
  
  module.exports = { getContracts };
  