import { httpService } from "../request/http"

const { get } = httpService

export const getUserMenu = () => get<MenuResponse[]>('/getmeun')