import "./LoginRegistro.css"

function LoginRegistro() {
  

    return <div class="container">
        <div class="row">
            <img src="Aprender-DAW\01-Desarrollo-web-cliente\react\PCCOMPONENTES\public\logo-pccomponentes (1).svg"></img>
        </div>
        <div class="row">
            <div class="col-6"></div>
            <div class="col-6">
            <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" />
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1" />
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
            </div>
        </div>
    </div>
}

export default LoginRegistro;