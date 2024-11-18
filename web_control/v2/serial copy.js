class SerialPortHandler {
    constructor(options, onConnect, onDisconnect) {
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;
        this.options = options;
        this.port = null;
        this.isOpened = false;
        this.#setupListeners();
    }

    async open() {
        try {
            const port = await navigator.serial.requestPort();
            await port.open(this.options);

            this.port = port;
            this.isOpened = true;

            return this.port.getInfo();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async close() {
        await this.port.close();
        this.isOpened = false;
    }

    async write(data) {
        const writer = this.port.writable.getWriter();
        const encoded = this.encoder.encode(data);
        await writer.write(encoded);
        writer.releaseLock();
    }

    async read() {
        while (this.port.readable) {
            const reader = this.port.readable.getReader();
            let chunks = '';

            try {
                while (true) {
                    const { value, done } = await reader.read();
                    const decoded = this.decoder.decode(value);

                    console.log("v=" + value + " / decoded=" + decoded + " / done=" + done + " / l=" + decoded.length);

                    chunks += decoded;

                    // done always return true and the buffer is 32 chars
                    // So if decoded string length = 32, we still have datas
                    // unless we are at the end of a log line
                    if (decoded.length < 32 || (decoded.length == 32 && decoded.slice(-2) == "\n\r")) {

                        console.log('Reading done.');
                        reader.releaseLock();
                        break;
                    }
                }
                return chunks;
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                reader.releaseLock();
            }
        }
    }

    #setupListeners() {
        navigator.serial.addEventListener('connect', this.onConnect);
        navigator.serial.addEventListener('disconnect', this.onDisconnect);
    }
}
