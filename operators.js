/**
 * 
 * @param {EventTarget} target 
 * @param {string} eventName 
 * @returns {ReadableStream}
 */
const fromEvent = (target, eventName) => {
    let _listener
    return new ReadableStream({
        start(controller) {
            _listener = (e) => controller.enqueue(e)
            target.addEventListener(eventName, _listener)
        },
        cancel() {
            target.removeEventListener(eventName, _listener)
        }
    })
}

/**
 * 
 * @param {Number} ms 
 * @returns {ReadableStream}
 */
const interval = (ms) => {
    let _intervalId
    return new ReadableStream({
        start(controller) {
            _intervalId = setInterval(() => {
                controller.enqueue(Date.now())
            }, ms)
        },
        cancel() {
            clearInterval(_intervalId)
        }
    })
}

/**
 * 
 * @param {Function} fn 
 * @returns {TransformStream}
 */
const map = (fn) => {
    return new TransformStream({
        transform(chunk, controller) {
            controller.enqueue(fn.bind(fn)(chunk))
        }
    })
}

/**
 * 
 * @typedef {ReadableStream | TransformStream} Stream 
 * @param {Stream[]} streams
 * @returns {ReadableStream}
 */
const merge = (streams) => {
    return new ReadableStream({
        async start(controller) {
            for (const stream of streams) {
                const reader = (stream.readable || stream).getReader()
                async function read() {
                    const { value, done} = await reader.read()
                    if (done) return
                    if (!controller.desiredSize) return
                    controller.enqueue(value)

                    return read()
                }
                read()
            }
        }
    })
}

/**
 * 
 * @typedef {function(): ReadableStream | TransformStream} StreamFunction
 * @param {StreamFunction} fn 
 * @param {object} options
 * @param {boolean} options.pairwise
 * @returns {TransformStream}
 */
const switchMap = (fn, options = {pairwise: true}) => {
    return new TransformStream({
        transform(chunk, controller) {
            const stream = fn.bind(fn)(chunk)
            const reader = (stream.readable || stream).getReader()
            async function read() {
                const { value, done} = await reader.read()
                if (done) return
                const result = options.pairwise ? [chunk, value] : value
                controller.enqueue(result)

                return read()
            }
            return read()
        }
    })
}

/**
 * Take values from the source stream until the provided stream emits a value.
 * @param {ReadableStream | TransformStream} stream
 * @returns {TransformStream}
 */
const takeUntil = (stream) => {
    const readAndFinish = async (stream, controller) => {
        const reader = (stream.readable || stream).getReader()
        const { value } = await reader.read()
        controller.enqueue(value)
        controller.terminate()
    }
    return new TransformStream({
        start(controller) {
            readAndFinish(stream, controller)
        },
        transform(chunk, controller) {
            controller.enqueue(chunk)
        }
    })
}

export { fromEvent, interval, map, merge, switchMap, takeUntil }