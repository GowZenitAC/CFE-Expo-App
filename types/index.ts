export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
}

export interface AuthContextType {
  user: User | null;
  signUp: (username: string, password: string, fullname: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// export type ReportFormValues = {
//   botiquin: boolean;
//   extintor: boolean;
//   gato_hidraulico: boolean;
//   cruceta: boolean;
//   lampara_mano: boolean;
//   cables_pasacorriente: boolean;
//   hora_inicio: string;
//   fecha_inicio: string;
//   fecha: string;
//   placas_vehiculo: string;
//   viseras: "bien" | "mal";
//   espejo_interior: "bien" | "mal";
//   espejo_lateral: "bien" | "mal";
//   cristales_puerta: "bien" | "mal";
//   parabrisas: "bien" | "mal";
//   elevadores_cristales: "bien" | "mal";
//   cerraduras: "bien" | "mal";
//   cinturon_seguridad: "bien" | "mal";
//   volante: "bien" | "mal";
//   luces_delanteras: "bien" | "mal";
//   limpieza_vehiculo: "bien" | "mal";
//   cuartos: "bien" | "mal";
//   luces_frenos: "bien" | "mal";
//   luces_intermitentes: "bien" | "mal";
//   freno_pie: "bien" | "mal";
//   freno_mano: "bien" | "mal";
//   nivel_aceite_motor: "bien" | "mal";
//   nivel_aceite_trans: "bien" | "mal";
//   liquido_frenos: "bien" | "mal";
//   llantas: "bien" | "mal";
//   llanta_refaccion: "bien" | "mal";
//   luces_reflejantes: "bien" | "mal";
//   observaciones?: string;
//   user_signature_id: string;
//   supervisor_nombre: string;
//   supervisor_firma_uri: string;
// }