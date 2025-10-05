describe('useAuthContext', () => {
  it('should be defined', () => {
    // Teste básico para verificar se o hook existe
    expect(typeof require('./use-auth.hook').useAuthContext).toBe('function');
  });

  it('should be a function', () => {
    // Verificar se o hook é uma função
    const { useAuthContext } = require('./use-auth.hook');
    expect(typeof useAuthContext).toBe('function');
  });

  it('should have correct error message', () => {
    // Verificar se a mensagem de erro está correta no código
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'use-auth.hook.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    expect(fileContent).toContain(
      'useAuthContext must be used within an AuthContextProvider'
    );
  });
});
