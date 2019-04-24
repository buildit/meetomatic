export interface DBService {
    init(): void;
    get(req, res): void;
    put(req, res): void;
    post(req, res): void;
    delete(req, res): void;
}