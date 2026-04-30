export type TipoConsulta = "ec" | "ics";

export interface PublicDetalleMora {
  year: string;
  impuesto: string;
  trenDeAseo: string;
  tasaBomberos: string;
  recargo: string;
  total: string;
  dias: number;
  impuestoNumerico: number;
  trenDeAseoNumerico: number;
  tasaBomberosNumerico: number;
  recargoNumerico: number;
  totalNumerico: number;
  amnistiaAplicada?: boolean;
}

export interface PublicPropiedad {
  claveCatastral: string;
  colonia: string;
  nombreColonia: string;
  detallesMora: PublicDetalleMora[];
  totalPropiedad: string;
  totalPropiedadNumerico: number;
  descuentoProntoPago?: string;
  descuentoProntoPagoNumerico?: number;
  totalAPagar?: string;
  totalAPagarNumerico?: number;
}

export interface PublicEstadoCuentaEC {
  fecha: string;
  hora: string;
  claveCatastral?: string;
  colonia?: string;
  nombreColonia?: string;
  detallesMora?: PublicDetalleMora[];
  propiedades?: PublicPropiedad[];
  totalGeneral: string;
  totalGeneralNumerico: number;
  descuentoProntoPago: string;
  descuentoProntoPagoNumerico: number;
  totalAPagar: string;
  totalAPagarNumerico: number;
  amnistiaVigente?: boolean;
  amnistiaAplicada?: boolean;
  amnistiaDescripcion?: string;
  fechaFinAmnistia?: string | null;
  tipoConsulta: "clave_catastral" | "dni";
}

export interface PublicDetalleMoraICS extends Omit<PublicDetalleMora, never> {
  otros: string;
  otrosNumerico: number;
}

export interface PublicEmpresaICS {
  numeroEmpresa: string;
  mes: string;
  detallesMora: PublicDetalleMoraICS[];
  totalPropiedad: string;
  totalPropiedadNumerico: number;
}

export interface PublicEstadoCuentaICS {
  fecha: string;
  hora: string;
  numeroEmpresa?: string;
  mes?: string;
  detallesMora?: PublicDetalleMoraICS[];
  empresas?: PublicEmpresaICS[];
  totalGeneral: string;
  totalGeneralNumerico: number;
  descuentoProntoPago: string;
  descuentoProntoPagoNumerico: number;
  totalAPagar: string;
  totalAPagarNumerico: number;
  amnistiaVigente?: boolean;
  amnistiaAplicada?: boolean;
  amnistiaDescripcion?: string;
  fechaFinAmnistia?: string | null;
  tipoConsulta: "ics" | "dni_rtn";
}

export type PublicEstadoCuenta =
  | { tipo: "ec"; data: PublicEstadoCuentaEC }
  | { tipo: "ics"; data: PublicEstadoCuentaICS };

export interface ApiErrorResponse {
  ok: false;
  status: number;
  code:
    | "captcha_invalid"
    | "rate_limit"
    | "not_found"
    | "validation"
    | "server_error"
    | "network";
  message: string;
}

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
