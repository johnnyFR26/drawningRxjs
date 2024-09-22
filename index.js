import { fromEvent, interval, map, merge, switchMap, takeUntil,  } from "./operators.js";

const canvas = document.getElementById('canvas');
const clearBtn = document.getElementById('clearBtn');
const ctx = canvas.getContext('2d');

const mouseEvents = {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
    leave: 'mouseleave',

    touchstart: 'touchstart',
    touchmove: 'touchmove',
    touchend: 'touchend',

    click: 'click'

}

const store = {
    db: [],
    get() {
        return this.db
    },
    set(item) {
        this.db.unshift(item)
    },
    clear(){
        this.db = []
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getMousePosition = (canvasDom, eventValue) => {
    const rect = canvasDom.getBoundingClientRect()
    return {
        x: eventValue.clientX - rect.left,
        y: eventValue.clientY - rect.top
    }
}

const resetCanvas = (width, height) => {
    const parent = canvas.parentElement
    canvas.width = width || parent.clientWidth * 0.9
    canvas.height = height || parent.clientHeight * 1.5

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'green'
    ctx.clientWidth = 4
}

resetCanvas()

const touchToMouse = (touchEvent, mouseEvent) => {
    const [touch] = touchEvent.touches.length ?
        touchEvent.touches :
        touchEvent.changedTouches

    return new MouseEvent(mouseEvent, {
        clientX: touch.clientX,
        clientY: touch.clientY
    })
}

merge([
    fromEvent(canvas, mouseEvents.down),
    fromEvent(canvas, mouseEvents.touchstart)
        .pipeThrough(map(e => touchToMouse(e, mouseEvents.touchstart)))
])
.pipeThrough(
    switchMap(e => {
        return merge([
            fromEvent(canvas, mouseEvents.move),
            fromEvent(canvas, mouseEvents.touchmove)
                .pipeThrough(map(e => touchToMouse(e, mouseEvents.move)))
        ])
        .pipeThrough(takeUntil(
            merge([
                fromEvent(canvas, mouseEvents.up),
                fromEvent(canvas, mouseEvents.leave),
                fromEvent(canvas, mouseEvents.touchend)
                    .pipeThrough(map(e => touchToMouse(e, mouseEvents.up)))
            ])
        ))
    })
)
.pipeThrough(map(function([mousedown, mousemove]) {
    this._lastPosition = this._lastPosition ?? mousedown

    const [from, to] = [this._lastPosition, mousemove]
        .map(item => getMousePosition(canvas, item))
    this._lastPosition = mousemove.type === mouseEvents.up ? null : mousemove

    return {from, to}

}))
.pipeTo(new WritableStream({
    write({from, to}) {
        store.set({from, to})        
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
    }
}))

fromEvent(clearBtn, mouseEvents.click)
    .pipeTo(new WritableStream({
        async write(chunk) {
            ctx.beginPath()
            ctx.strokeStyle = 'white'

            for (const {from, to} of store.get()) {
                ctx.moveTo(from.x, from.y)
                ctx.lineTo(to.x, to.y)
                ctx.stroke()

                await sleep(10)
            }
            resetCanvas(canvas.width, canvas.height)
            store.clear()
        }
    }))
