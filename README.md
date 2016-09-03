# Delimted continuation monad and monad transformer for [Akh Javascript monad transformer library](https://github.com/mattbierner/akh)

The [delimited continuation][dcont] transformer, `DContT`, layers delimited control over a monad. The base type, `DCont`, provides delimited control on its own.
The delimited continuation transformer is a monad, functor, and applicative functor.

```bash
# To use as standalone package
$ npm install --save akh.dcont

# To use as part of akh library
$ npm install --save akh
```

## Usage
The dcont monad/transformer implements the [Fantasy Land][fl] monad, function, and applicative functor interfaces.

<a href="https://github.com/fantasyland/fantasy-land">
    <img src="https://raw.github.com/fantasyland/fantasy-land/master/logo.png" align="right" width="82px" height="82px" alt="Fantasy Land logo" />
</a>

```js
// Delimited continuation monad
require('akh.dcont').DCont
require('akh').DCont

// Delimited continuation monad transformer
require('akh.dcont').DContT
require('akh').DContT
```

#### `DCont.run(m, k)`, `m.run(k)`
Perform a delimited continuation computation `m` and complete with outer continuation `k`.

```js
const liftM2 = require('akh').base.liftM2
const dcont = require('akh').dcont

var list = liftM2.bind(null, (x, y) -> [x, y])

const c = dcont.reset((p) =>
    liftM2((x, y) => x + y,
        dcont.shift(p, k =>
            list(k(of(1)), k(of(2))),
        dcont.shift(p, k =>
            list(k(of(10)), k(of(20))))

dcont.run(c, console.log) // logs: [[11, 21], [12, 22]]
```

#### `DContT.run(m, k)`
Same as `DContT::run` but for transformed types


## Delimited Control Interface
All DCont operations and methods are defined on both the type and its instances.

#### `M.newPrompt`
Create a new unique prompt that can be used to delimit a continuation.

#### `M.pushPrompt(prompt, c)`
Push `prompt` on to the control stack, delimiting the continuation, and evaluate computation `c`.

#### `M.withSubCont(prompt, f)`
Capture the continuation delimited by `prompt` and call `f` with it. `f` maps the delimited continuation to a computation. The delimited control structure passed to `f` should be considered opaque.

#### `M.pushSubCont(subk, c)`
Push an entire sub continuation `sunk` onto the stack and evaluate computation `c`.

#### `M.reset(f)`
Delimit a continuation, calling `f` with delimiting prompt. `f` maps the prompt to a computation that is performed inside the delimited context.

#### `M.shift(p, f)`
Capture the continuation delimited by `p`, reify the continuation, and pass it to `f`. `f` can invoke the reified continuation with a computation to evaluate the rest of the delimited continuation, or return a computation directly to break out.


## Contributing
Contributions are welcome.

To get started:

```bash
$ cd akh-dcont
$ npm install # install dev packages
$ npm test # run tests
```


[dcont]: http://en.wikipedia.org/wiki/Delimited_continuation
[fl]: https://github.com/fantasyland/fantasy-land