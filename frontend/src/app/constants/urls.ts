import { environment } from 'src/environments/environment';

const BASE_URL = environment.production
  ? 'https://your-backend-domain-on-render.com:10000'
  : 'http://localhost:3000';

export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';

export const POST_URL = BASE_URL + '/api/images';
export const POST_LOC_URL = BASE_URL + '/uploads/';

export const FORM_URL = BASE_URL + '/api/contact';
export const COMMENTS_URL = BASE_URL + '/api/comments';
