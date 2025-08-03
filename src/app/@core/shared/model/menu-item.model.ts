import { NbMenuItem } from '@nebular/theme';

export declare abstract class MenuItem extends NbMenuItem {
  key?: string;
  type?: string;
  roles?: string[];
  children?: MenuItem[];
  parent?: MenuItem;
}
