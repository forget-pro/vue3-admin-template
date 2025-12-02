interface RootObject {
    code: number;
    data: Datum[];
}

interface MenuResponse {
    url: string;
    icon: string;
    name: string;
    children: MenuChildren[];
    ismenu?: number;
}

interface MenuChildren {
    name: string;
    icon: string;
    url: string;
    children?: MenuChildren[];
    ismenu?: number;
}