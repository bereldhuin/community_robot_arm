// Inspired from https://yarkov.tech/en/blog/2022-11-04/using-the-web-serial-api-to-communicate-with-the-microcontroller/

var EOT = "\r";

class Application {
    constructor(root) {
        if (!("serial" in navigator)) {
            console.error("Web Serial API is not supported in your browser.");
            return;
        }

        this.serialPortHandler = new SerialPortHandler(
            { baudRate: 115200 },
            () => console.log("Device connected."),
            () => {
                console.log("Device disconnected.");
                this.#disconnectHandler();
            }
        );

        /**
         * DOM Elements
         */
        this.$root = root;
        this.$connectButton = this.$root.querySelector("#btnConnect");
        this.$disconnectButton = this.$root.querySelector("#btnDisconnect");

        this.$sequenceButton = this.$root.querySelector("#btnSequence");
        this.$gcodeButtons = document.querySelectorAll(".btn-gcode");

        this.$sequenceData = this.$root.querySelector("#sequence");
        this.$serialLog = this.$root.querySelector("#serialLog");
        this.$status = this.$root.querySelector("#status");
        //this.$vendorId = this.$root.querySelector("#vendor_id");
        //this.$productId = this.$root.querySelector("#product_id");

        this.#setupEvents();
    }

    /**
     * Handlers for connecting, disconnecting and sending a command
     */
    #setupEvents() {
        this.$connectButton.addEventListener("click", this.#connectHandler.bind(this));
        this.$disconnectButton.addEventListener("click", this.#disconnectHandler.bind(this));

        this.$sequenceButton.addEventListener("click", this.#submitSequence.bind(this));

        this.$gcodeButtons.forEach(gcodeButton => {
            gcodeButton.addEventListener('click', this.#submitGcode.bind(this));
        });

        this.$sequenceData.value = localStorage.getItem("sequence");
    }


    /**
     * Open serial port and notify user of connection status
     */
    async #connectHandler() {
        try {
            if (this.serialPortHandler.isOpened) return;
            const info = await this.serialPortHandler.open();
            console.log("Port opened: ", info);
            //this.$terminalForm.elements.input.removeAttribute("disabled");
            //this.$terminalForm.elements.send.removeAttribute("disabled");
            //this.$vendorId.textContent = "0x" + info.usbVendorId.toString(16);
            //this.$productId.textContent = "0x" + info.usbProductId.toString(16);
            this.$status.textContent = "CONNECTED";

            const message = await this.serialPortHandler.read();
            this.$serialLog.textContent += message;
            console.log("Message received: \n" + message);

        } catch (error) {
            this.$status.textContent = "ERROR" + error.message;
        }
    }

    /**
     * Closes the serial port and updates the connection status.
     */
    async #disconnectHandler() {
        if (!this.serialPortHandler.isOpened) return;
        await this.serialPortHandler.close();
        //this.$terminalForm.elements.input.setAttribute("disabled", "true");
        //this.$terminalForm.elements.send.setAttribute("disabled", "true");
        //this.$vendorId.textContent = "-";
        //this.$productId.textContent = "-";
        this.$status.textContent = "NOT CONNECTED";
    }

    /**
     * Writes data to the serial port and reads the response
     */
    async #submitHandler(datas) {
        //e.preventDefault();
        //$form.reset();
        //const $form = e.target;
        //const datas = ["G28", "G4 S5", "G0 X-100 Y140 Z-80", "G4 S5", "G0 X100 Y140 Z100", "G4 S5"]

        //const data = $form.elements.input.value;
        for (const data of datas) {
            console.log(data);
            if (this.serialPortHandler.isOpened && data) {

                this.$serialLog.innerHTML += ">" + data + "\r";
                await this.serialPortHandler.write(data + "\r");

                const message = await this.serialPortHandler.read();
                this.$serialLog.textContent += message;
                console.log("Message received: \n" + message);
            }
            this.$serialLog.scrollTo(0, this.$serialLog.scrollHeight);
        }
    }


    /**
     * Send Gcodes associated to a button
     */
    async #submitGcode(e) {
        const datas = e.target.dataset.gcode.split(";");
        console.log(datas);
        this.#submitHandler(datas);
    }

    /**
     * Send sequence 
     */
    async #submitSequence() {

        localStorage.setItem("sequence", this.$sequenceData.value);

        const datas = this.$sequenceData.value.split("\n");
        this.#submitHandler(datas);

    }
}


new Application(document.getElementById("app"));