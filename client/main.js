// Create an instance of Notyf
let notyf = new Notyf();

class Util {
  notyfPos() {
    return { x: "center", y: "top" };
  }

  error(msg) {
    return notyf.error({
      message: msg,
      dismissible: true,
      position: this.notyfPos(),
    });
  }

  success(msg) {
    return notyf.success({
      message: msg,
      dismissible: true,
      position: this.notyfPos(),
    });
  }

  select(elm) {
    return document.querySelector(elm);
  }

  selectAll(elm) {
    return document.querySelectorAll(elm);
  }

  async post(url, headers = { "content-type": "application/json" }, body) {
    if (
      !url ||
      !~headers ||
      url === undefined ||
      url === "" ||
      headers === undefined ||
      body === "" ||
      body === undefined
    ) {
      throw Error("missing parameters for post:  url, headers");
    }

    const req = await fetch(url, {
      method: "POST",
      headers,
      body: typeof body === "string" ? body : JSON.stringify(body),
    });

    const res = await req.json();

    return { req, res };
  }
}

class Editor {
  constructor() {
    this.util = new Util();
  }

  setupEditor() {
    const runBtn = this.util.select(".run-btn");
    const javaInput = this.util.select(".java-code-input");
    const editorElem = this.util.select(".editor-code");
    const checkbox = this.util.select(".check");

    // toggle input
    console.log(checkbox.checked);
    checkbox.onclick = () => {
      javaInput.classList.toggle("hide");
    };

    let flask = new CodeFlask(editorElem, {
      language: "js",
      lineNumbers: true,
    });

    // update the editor with default code
    flask.updateCode(`
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
    `);

    // run the code
    runBtn.onclick = async () => {
      const code = flask.getCode();
      // send to backend to be compiled
      if (checkbox.checked === true) {
        if (javaInput.value === "") {
          return this.util.error(
            "parameter input is empty, make sure to pass an input"
          );
        }
        //   compile codee with input
        return this.compileJavaCodeWithInput(code, javaInput.value);
      } else {
        return await this.compileJavaWithoutInput(code);
      }
    };
  }

  async compileJavaWithoutInput(code) {
    const runBtn = this.util.select(".run-btn");
    const output = this.util.select(".output-text");

    if (code === undefined || code === "") {
      return this.util.error("code is missing, cant compile empty code.");
    }

    // post the data
    const url = "http://localhost:5000/compileJava";
    const headers = {
      "content-type": "application/json",
    };
    const body = {
      code,
      ext: "java",
    };
    try {
      // add a loading class to button to prevent user from clicking onn the button twice
      runBtn.innerHTML = "Compilling...";
      runBtn.classList.add("loading");

      const { req, res } = await this.util.post(url, headers, body);

      console.log(res, req);

      if (req.status === 200 && res.output) {
        // if everything went well, remove the loading classs from button
        runBtn.innerHTML = "Run Code";
        runBtn.classList.remove("loading");

        // display the data gotten from server
        output.textContent = res.output;
        output.classList.remove("error");
        return this.util.success("Code Compiled Succesful");
      } else if (req.status === 200 && res.errorMsg) {
        runBtn.innerHTML = "Run Code";
        runBtn.classList.remove("loading");
        // display the data gotten from server
        output.classList.remove("error");
        output.classList.add("error");
        output.textContent = res.errorMsg;
        return this.util.error("Error compilling code.");
      } else {
        return this.util.success("Something went wrong compiling code");
      }
    } catch (e) {
      console.log(e);
      runBtn.classList.remove("loading");
      output.classList.add("error");
      output.textContent = " Server Error: failed to compile code.";
      return this.util.error("Server Error: Error compiling code");
    }
  }

  async compileJavaCodeWithInput(code, input) {
    const runBtn = this.util.select(".run-btn");
    const output = this.util.select(".output-text");

    if (
      code === undefined ||
      code === "" ||
      input === "" ||
      input == undefined
    ) {
      return this.util.error("code is missing, cant compile empty code.");
    }

    // post the data
    const url = "http://localhost:5000/compileJavaInput";
    const headers = {
      "content-type": "application/json",
    };
    const body = {
      code,
      ext: "java",
      input,
    };
    try {
      // add a loading class to button to prevent user from clicking onn the button twice
      runBtn.innerHTML = "Compilling...";
      runBtn.classList.add("loading");

      const { req, res } = await this.util.post(url, headers, body);

      console.log(res, req);

      if (req.status === 200 && res.output) {
        // if everything went well, remove the loading classs from button
        runBtn.innerHTML = "Run Code";
        runBtn.classList.remove("loading");

        // display the data gotten from server
        output.textContent = res.output;
        output.classList.remove("error");
        return this.util.success("Code Compiled Succesful");
      } else if (req.status === 200 && res.errorMsg) {
        runBtn.innerHTML = "Run Code";
        runBtn.classList.remove("loading");
        // display the data gotten from server
        output.classList.remove("error");
        output.classList.add("error");
        output.textContent = res.errorMsg;
        return this.util.error("Error compilling code.");
      } else {
        return this.util.success("Something went wrong compiling code");
      }
    } catch (e) {
      console.log(e);
      runBtn.classList.remove("loading");
      output.classList.add("error");
      output.textContent = " Server Error: failed to compile code.";
      return this.util.error("Server Error: Error compiling code");
    }
  }

  init() {
    this.setupEditor();
  }
}

new Editor().init();
