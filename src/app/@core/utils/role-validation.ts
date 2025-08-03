export function isGranted(roles: string[], scopes: any[]): boolean {
  //return true;
  if (roles) {
    //const ROLE_PREFIX = 'ROLE_';
    const ROLE_PREFIX = '';
    if (roles.includes('*')) {
      return true;
    }
    for (let i = 0; i < roles.length; i++) {
      for (let j = 0; j < scopes.length; j++) {
        //if (scopes[j].authority === `${ROLE_PREFIX}${roles[i]}`) {
        if (scopes[j] === `${ROLE_PREFIX}${roles[i]}`) {
          return true;
        }
      }
    }
  }
  return false;
}
