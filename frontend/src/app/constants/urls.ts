import { environment } from 'src/environments/environment';

const BASE_URL = environment.production
  ? 'https://weather-deploy-znwd.onrender.com'
  : 'http://localhost:5000';

export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';

export const POST_URL = BASE_URL + '/api/images';

export const FORM_URL = BASE_URL + '/api/contact';
export const COMMENTS_URL = BASE_URL + '/api/comments';
