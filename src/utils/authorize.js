// import { query, delUrlParam } from '../utils/utils';
import { wxAuthorizeLink } from '../api/api';
import Cookies from 'js-cookie';
import { ua } from '@/utils/utils';

export function authorize() {
  location.href = wxAuthorizeLink();
}
