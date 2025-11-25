import { HttpInterceptorFn } from '@angular/common/http';

export const teaClinicInterceptor: HttpInterceptorFn = (req, next) => {
  // Verifica se a requisição é para a API do TEA
  if (req.url.includes('/api/v1/') && !req.url.includes('/login') && !req.url.includes('/auth')) {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const user = JSON.parse(authData);
        const teaCliId = user.teaCliId;
        
        // Se o usuário tem teaCliId, adiciona como parâmetro na requisição
        if (teaCliId) {
          const clonedReq = req.clone({
            setParams: {
              teaCliId: String(teaCliId)
            }
          });
          return next(clonedReq);
        }
      }
    } catch (e) {
      console.error('Erro ao adicionar teaCliId na requisição:', e);
    }
  }
  
  return next(req);
};
