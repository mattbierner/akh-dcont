Delimted continuation monad for [Akh Javascript monad transformer collection](https://github.com/mattbierner/akh)

## API
The [delimited continuation][dcont] transformer, `akh::trans::dcont`, layers delimited control over a monad. The base type, `aka::dcont`, provides delimited control on its own.
The delimited continuation transformer is a monad, functor, and applicative functor.

```js
// Delimited continuation monad
require('akh.dcont').DCont
require('akh').DCont
require('akh').type.dcont

// Delimited continuation monad transformer
require('akh.dcont').DContT
require('akh').DContT
require('akh').trans.dcont
```

#### `DCont.run(m, k)`
Perform a delimited continuation computation `m` and complete with outer continuation `k`.

```js
const liftM2 = require('akh').base.liftM2;
const dcont = require('akh').dcont;

var list = liftM2.bind(null, (x, y) -> [x, y]);

const c = dcont.reset((p) =>
    liftM2((x, y) => x + y,
        dcont.shift(p, k =>
            list(k(of(1)), k(of(2))),
        dcont.shift(p, k =>
            list(k(of(10)), k(of(20))));

dcont.run(c, console.log); // logs: [[11, 21], [12, 22]]
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

[dcont]: http://en.wikipedia.org/wiki/Delimited_continuation