

export interface iRepositoryG<T> {
 findAll(): Promise<Partial<T>[]>
 findbyID(id: Partial<T>): Promise<Partial<T>>
 create(data: Partial<T>): Promise<Partial<T>>
 deleteByID(data: Partial<T>): void
 updateByID(data: Partial<T>): void
}

