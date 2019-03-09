export interface Function {
    maChucNang?: string;
    tenChucNang?: string;
    duongDan?: string;
    bieuTuong?: string;
    viTri?: string;
    status?: boolean;

    read?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;

    hasRead?: boolean;
    hasCreate?: boolean;
    hasUpdate?: boolean;
    hasDelete?: boolean;
}
