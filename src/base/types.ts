import type { ProtocolHeader } from './buffer'

// @ts-expect-error PartialByKeys pk
export type PartialByKeys<O extends Record<string, any>, U = keyof O, UU = U extends keyof O ? U : never, PO = Partial<Pick<O, UU>>> =
  PO & {
    [K in keyof O as K extends U ? never : K]: O[K]
  }

// reference https://stackoverflow.com/questions/49682569/typescript-merge-object-types
export type Merge<A, B> = {
  [K in keyof A | keyof B]:
  K extends keyof A & keyof B
    ? A[K] | B[K]
    : K extends keyof B
      ? B[K]
      : K extends keyof A
        ? A[K]
        : never
}

export type Nullable<T> = null | undefined | T

export interface ISocket {
  write(data: Uint8Array): void
  end(): void
}

export interface IWebSocket {
  send(data: Uint8Array): void
  close(): void
}

type Options = PartialByKeys<WSOptions, keyof AuthOptions | keyof ConnectionOptions>

export interface RoomResponse {
  code: number
  msg: string
  message: string
  data: {
    room_id: number
    short_id: number
    uid: number
    need_p2p: number
    is_hidden: boolean
    is_locked: boolean
    is_portrait: boolean
    live_status: number
    hidden_till: number
    lock_till: number
    encrypted: boolean
    pwd_verified: boolean
    live_time: number
    room_shield: number
    is_sp: number
    special_type: number
  }
}

export const DEFAULT_WS_OPTIONS: Options = {
  raw: false,
  stub: true,
  ssl: true,
  // clientVer: '2.0.11',
  // platform: 'web',
  // protover: 2,
  // uid: 0,
  // type: 2,
}

export interface BaseLiveClientOptions extends Options {
  socket: ISocket | IWebSocket
  room: number
  zlib: IZlib
}

export interface BaseOptions {
  /**
   * 是否获取原始消息
   * @default false
   */
  raw?: boolean
  /**
   * 是否获取全部信息
   * ```typescript
   *  如果关闭 stub, live.on('msg'), 将不生效
   * ```
   * @default true
   */
  stub?: boolean
}

export interface AuthOptions {
  authBody?: Uint8Array
  key?: any
}

export interface ConnectionOptions {
  url?: string
}

export interface WSOptions extends BaseOptions, AuthOptions, ConnectionOptions {
  ssl?: boolean
  clientVer?: `${number}.${number}.${number}` | `${number}.${number}.${number}.${number}`
  platform?: 'web'
  protover?: 1 | 2 | 3
  uid?: number
  type?: number
}

export interface TCPOptions extends WSOptions {}

export interface LiveHelloMessage {
  clientver?: `${number}.${number}.${number}` | `${number}.${number}.${number}.${number}`
  platform?: 'web'
  protover?: 1 | 2 | 3
  roomid: number
  uid?: number
  type?: number
  key?: any
}

export interface MessageMeta extends ProtocolHeader {}

export interface Message<T> {
  meta: MessageMeta
  data: T
}

export interface IZlib<T extends Uint8Array = Uint8Array> {
  inflateAsync(v: T): Promise<T>
  brotliDecompressAsync(v: T): Promise<T>
}

export interface IWriter {
  write(offset: number, len: number, val: number): void
}

export interface IReader {
  read(offset: number, len: number): number
}