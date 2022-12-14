import path from 'path';
import fs from 'fs';
import { homedir } from 'os';
const mkdir = require('mkdir-p');

export namespace OsUtils {
    export function zeros(str_: string | any, total_: number): string {
        // Returns str_ prefixed with '0's.
        if (typeof str_ !== 'string') {
            str_ = '' + str_;
        }
    
        if (str_.length === 0 || str_.length >= total_) {
            return str_;
        }
    
        return '0000000000'.slice(0, total_ - str_.length) + str_;
    }
    
    export function exist(name: string): fs.Stats | undefined {
        try {
            return fs.statSync(name);
        } catch (e) {
        }
    }

    export function isDirectory(name: string): boolean | undefined {
        // 0. Returns true/false if dir/file exists, otherwise undefined (i.e. aka exist()).
        try {
            return fs.statSync(name).isDirectory();
        } catch (e) {
        }
    }

    export function toUnix(fileName: string): string {
        const double = /\/\//;
        let res: string = fileName.replace(/\\/g, '/');
        while (res.match(double)) {
            res = res.replace(double, '/');
        }
        return res;
    }
    
    export function toWindows(fileName: string): string {
        let res: string = fileName.replace(/\//g, '/');
        res = res.replace(/\//g, '\\');
        return res;
    }
    
    export function ensureNameUnique(name: string, nameIsFname: boolean = true): string {
        // 0. Ensure that file/folder name is unique.
        let basename = '';
        let ext = '';
        let index = 0;
        let initialized = false;
        while (true) {
            let st: fs.Stats | undefined = exist(name);
            if (!st || (st.isDirectory() === nameIsFname)) { // case if folder exist but we create file name.
                return name;
            }
            if (!initialized) {
                let org: path.ParsedPath = path.parse(name);
                if (nameIsFname) {
                    org.base = org.name; // to set base name wo/ ext.
                    ext = org.ext; // folder name may have '.', so keep ext only for file names.
                }
                org.ext = '';
                basename = path.format(org);
                initialized = true;
            }
            index++;
            name = `${basename} (${index})${ext}`;
        }
    } //ensureNameUnique()

    export function getDesktopPath(): string {
        let home = homedir();
        if (!home) {
            throw new Error('User HOME is undefined');
        }
        return path.join(home, 'Desktop');
    }

    export function nowDay(d: Date): string {
        return `${zeros(d.getMonth() + 1, 2)}.${zeros(d.getDate(), 2)}.${d.getFullYear() % 100}`;
    }

    export function nowTime(d: Date): string {
        return `${zeros(d.getHours(), 2)}.${zeros(d.getMinutes(), 2)}.${zeros(d.getSeconds(), 2)}.${zeros(d.getMilliseconds(), 3)}`;
    }

    export function nowDayTime(delimiter: string = ' at ') {
        let d: Date = new Date();
        return `${nowDay(d)}${delimiter}${nowTime(d)}`;
    }

    export function mkdirSync(dir: string): void {
        mkdir.sync(dir);
    }

} //namespace osutils
