import { Permission } from './permission.model';

export interface Role {
    id?: string;
    name?: string;
    checked?: boolean;
    phanQuyens?: Permission[];
}
