import * as THREE from 'three'

const ROOM = { halfX: 5, halfZ: 7, height: 3.4 }
const PLAYER_RADIUS = 0.35
const BOARD_POS = new THREE.Vector3(0, 1.6, -ROOM.halfZ + 0.22)
const STAND_HEIGHT = 1.6
const CROUCH_HEIGHT = 1.05
const BASE_FOV = 70
const ZOOM_FOV = 46
const PALETTE = {
  cream: 0xfbf1da,
  board: 0x27433b,
  wall: 0xf6e5de,
  floor: 0xe7d7d0,
  wood: 0xb98a5a,
  mint: 0x8fd9b6,
  sky: 0xa9d8f0,
  rose: 0xf4c3d0,
  peach: 0xf4a87c,
  yellow: 0xf7d26a,
  ink: 0x1c1410,
  white: 0xfff8f6,
}

export function buildClassroom({ mount, competency, onNearBoard, onInteract }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xfff1eb)
  scene.fog = new THREE.Fog(0xfff1eb, 17, 28)

  const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 80)
  camera.rotation.order = 'YXZ'
  camera.position.set(0, 1.6, 4.2)
  camera.rotation.y = 0

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0xfff1eb)
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.touchAction = 'none'
  mount.style.touchAction = 'none'
  mount.style.userSelect = 'none'
  renderer.domElement.tabIndex = 0
  mount.appendChild(renderer.domElement)

  let yaw = 0
  let pitch = 0
  const disposables = []
  const colliders = []
  let controlsEnabled = true
  let raf = 0
  let nearBoard = false
  let lastBoardText = competency?.items?.[0]?.q ?? competency?.competency ?? 'Handa na ang klase.'
  let flashTimer = 0
  let jumpVelocity = 0
  let grounded = true
  let zoomHeld = false
  let targetFov = BASE_FOV

  const sharedBox = track(new THREE.BoxGeometry(1, 1, 1))
  const sharedLeg = track(new THREE.BoxGeometry(0.12, 1, 0.12))
  const sharedHead = track(new THREE.SphereGeometry(0.22, 12, 10))
  const materialCache = new Map()

  function track(resource) {
    disposables.push(resource)
    return resource
  }

  function material(color, kind = 'lambert') {
    const key = `${kind}:${color}`
    if (!materialCache.has(key)) {
      const mat = kind === 'basic'
        ? new THREE.MeshBasicMaterial({ color })
        : new THREE.MeshLambertMaterial({ color })
      materialCache.set(key, mat)
      track(mat)
    }
    return materialCache.get(key)
  }

  function box({ x, y, z, w, h, d, color, collide = false }) {
    const mesh = new THREE.Mesh(sharedBox, material(color))
    mesh.position.set(x, y, z)
    mesh.scale.set(w, h, d)
    scene.add(mesh)
    if (collide) colliders.push({ x, z, halfX: w / 2 + PLAYER_RADIUS, halfZ: d / 2 + PLAYER_RADIUS })
    return mesh
  }

  function leg(x, y, z, height, color) {
    const mesh = new THREE.Mesh(sharedLeg, material(color))
    mesh.position.set(x, y, z)
    mesh.scale.set(1, height, 1)
    scene.add(mesh)
    return mesh
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.78))
  const key = new THREE.DirectionalLight(0xfff4e0, 0.8)
  key.position.set(4, 8, 6)
  scene.add(key)
  const boardLight = new THREE.PointLight(0xffdfaa, 1.1, 8)
  boardLight.position.set(0, 2.6, -4.8)
  scene.add(boardLight)

  buildRoom()
  const board = buildBoard()
  buildTeacherArea()
  buildStudentArea()
  drawBoard(lastBoardText)

  const keys = new Set()
  const velocity = new THREE.Vector3()
  const touchState = new Map()
  const touchMove = new THREE.Vector2()
  const forward = new THREE.Vector3()
  const right = new THREE.Vector3()
  const candidate = new THREE.Vector3()
  const clock = new THREE.Clock()

  const onKeyDown = (event) => {
    keys.add(event.code)
    if (!controlsEnabled) return
    if ((event.code === 'KeyE' || event.code === 'KeyF') && nearBoard) onInteract?.()
    if (event.code === 'Space' && grounded) {
      event.preventDefault()
      jumpVelocity = 3.8
      grounded = false
    }
  }
  const onKeyUp = (event) => keys.delete(event.code)
  const onCanvasClick = () => {
    renderer.domElement.focus()
    if (controlsEnabled && !hasActiveTouch()) renderer.domElement.requestPointerLock?.()
  }
  const onContextMenu = (event) => event.preventDefault()
  let mouseDragging = false
  let lastMouseX = 0
  let lastMouseY = 0
  const onMouseDown = (event) => {
    if (!controlsEnabled) return
    if (event.button === 0 && document.pointerLockElement !== renderer.domElement) {
      mouseDragging = true
      lastMouseX = event.clientX
      lastMouseY = event.clientY
    }
    if (event.button === 2) {
      zoomHeld = true
      targetFov = ZOOM_FOV
    }
  }
  const onMouseUp = (event) => {
    if (event.button === 0) mouseDragging = false
    if (event.button === 2) {
      zoomHeld = false
      targetFov = BASE_FOV
    }
  }
  const onMouseMove = (event) => {
    if (!controlsEnabled) return
    const locked = document.pointerLockElement === renderer.domElement
    if (locked) {
      yaw -= event.movementX * 0.0025
      pitch = clamp(pitch - event.movementY * 0.0025, -1.15, 1.15)
      return
    }
    if (!mouseDragging) return
    const dx = event.clientX - lastMouseX
    const dy = event.clientY - lastMouseY
    yaw -= dx * 0.004
    pitch = clamp(pitch - dy * 0.004, -1.15, 1.15)
    lastMouseX = event.clientX
    lastMouseY = event.clientY
  }
  const onWheel = (event) => {
    if (!controlsEnabled) return
    event.preventDefault()
    targetFov = clamp(targetFov + Math.sign(event.deltaY) * 5, 42, 82)
    zoomHeld = false
  }
  const onPointerDown = (event) => {
    if (event.pointerType !== 'touch') return
    event.preventDefault()
    mount.setPointerCapture?.(event.pointerId)
    touchState.set(event.pointerId, {
      side: event.clientX < (mount.getBoundingClientRect().left + mount.clientWidth / 2) ? 'move' : 'look',
      sx: event.clientX,
      sy: event.clientY,
      lx: event.clientX,
      ly: event.clientY,
    })
  }
  const onPointerMove = (event) => {
    const touch = touchState.get(event.pointerId)
    if (!touch || !controlsEnabled) return
    event.preventDefault()
    if (touch.side === 'move') {
      touchMove.x = clamp((event.clientX - touch.sx) / 64, -1, 1)
      touchMove.y = clamp((event.clientY - touch.sy) / 64, -1, 1)
      return
    }

    yaw -= (event.clientX - touch.lx) * 0.004
    pitch = clamp(pitch - (event.clientY - touch.ly) * 0.004, -1.15, 1.15)
    touch.lx = event.clientX
    touch.ly = event.clientY
  }
  const onPointerEnd = (event) => {
    const touch = touchState.get(event.pointerId)
    if (touch?.side === 'move') touchMove.set(0, 0)
    touchState.delete(event.pointerId)
  }
  const onResize = () => resize()

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('resize', onResize)
  renderer.domElement.addEventListener('click', onCanvasClick)
  renderer.domElement.addEventListener('contextmenu', onContextMenu)
  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mouseup', onMouseUp)
  renderer.domElement.addEventListener('mouseleave', onMouseUp)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mousemove', onMouseMove)
  mount.addEventListener('pointerdown', onPointerDown, { passive: false })
  mount.addEventListener('pointermove', onPointerMove, { passive: false })
  mount.addEventListener('pointerup', onPointerEnd)
  mount.addEventListener('pointercancel', onPointerEnd)
  mount.addEventListener('wheel', onWheel, { passive: false })

  resize()
  tick()

  return {
    dispose,
    setControls(enabled) {
      controlsEnabled = enabled
      if (!enabled) {
        document.exitPointerLock?.()
        velocity.set(0, 0, 0)
        touchMove.set(0, 0)
        targetFov = BASE_FOV
        zoomHeld = false
      }
    },
    setBoardText(text) {
      lastBoardText = text || ''
      drawBoard(lastBoardText)
    },
    markBoard(ok) {
      window.clearTimeout(flashTimer)
      drawBoard(ok ? 'Tama!' : 'Subukan ulit', ok)
      flashTimer = window.setTimeout(() => drawBoard(lastBoardText), 850)
    },
    zoom(delta) {
      zoomHeld = false
      targetFov = clamp(targetFov + delta, 42, 82)
    },
  }

  function buildRoom() {
    box({ x: 0, y: -0.05, z: 0, w: ROOM.halfX * 2, h: 0.1, d: ROOM.halfZ * 2, color: PALETTE.floor })
    box({ x: 0, y: ROOM.height, z: 0, w: ROOM.halfX * 2, h: 0.1, d: ROOM.halfZ * 2, color: PALETTE.cream })
    box({ x: 0, y: ROOM.height / 2, z: -ROOM.halfZ, w: ROOM.halfX * 2, h: ROOM.height, d: 0.2, color: PALETTE.wall })
    box({ x: 0, y: ROOM.height / 2, z: ROOM.halfZ, w: ROOM.halfX * 2, h: ROOM.height, d: 0.2, color: PALETTE.wall })
    box({ x: -ROOM.halfX, y: ROOM.height / 2, z: 0, w: 0.2, h: ROOM.height, d: ROOM.halfZ * 2, color: PALETTE.wall })
    box({ x: ROOM.halfX, y: ROOM.height / 2, z: 0, w: 0.2, h: ROOM.height, d: ROOM.halfZ * 2, color: PALETTE.wall })

    for (let i = 0; i < 5; i += 1) {
      const x = -3.7 + i * 1.85
      box({ x, y: 3.25, z: 0, w: 1.1, h: 0.04, d: 13.4, color: 0xffffff })
    }
  }

  function buildBoard() {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    const texture = track(new THREE.CanvasTexture(canvas))
    texture.colorSpace = THREE.SRGBColorSpace
    const mat = track(new THREE.MeshBasicMaterial({ map: texture }))
    const geometry = track(new THREE.PlaneGeometry(5.6, 2.65))
    const mesh = new THREE.Mesh(geometry, mat)
    mesh.position.copy(BOARD_POS)
    scene.add(mesh)

    box({ x: 0, y: 0.42, z: -ROOM.halfZ + 0.25, w: 5.95, h: 0.16, d: 0.18, color: PALETTE.wood })

    return { canvas, ctx, texture, mesh }
  }

  function drawBoard(text, flash) {
    const { ctx, texture } = board
    ctx.fillStyle = flash === true ? '#1f7a56' : flash === false ? '#87333a' : '#27433b'
    ctx.fillRect(0, 0, 1024, 512)
    ctx.strokeStyle = '#b98a5a'
    ctx.lineWidth = 18
    ctx.strokeRect(9, 9, 1006, 494)
    ctx.fillStyle = '#fff8f6'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '700 42px system-ui, -apple-system, Segoe UI, sans-serif'

    const lines = wrapText(ctx, String(text || ''), 870)
    const lineHeight = lines.length > 5 ? 48 : 58
    const start = 256 - ((lines.length - 1) * lineHeight) / 2
    lines.slice(0, 7).forEach((line, index) => ctx.fillText(line, 512, start + index * lineHeight))
    texture.needsUpdate = true
  }

  function buildTeacherArea() {
    box({ x: 0, y: 0.42, z: -5.3, w: 2.3, h: 0.22, d: 0.9, color: PALETTE.wood, collide: true })
    for (const x of [-0.95, 0.95]) for (const z of [-5.65, -4.95]) leg(x, 0.18, z, 0.36, PALETTE.wood)
    const teacher = makePerson(PALETTE.yellow, 0.95)
    teacher.position.set(1.65, 0, -5.5)
    teacher.rotation.y = Math.PI
    scene.add(teacher)
  }

  function buildStudentArea() {
    const colors = [PALETTE.mint, PALETTE.sky, PALETTE.rose, PALETTE.peach]
    const xs = [-2.45, 0, 2.45]
    const zs = [-2.55, -0.8, 0.95, 2.7]
    zs.forEach((z, row) => {
      xs.forEach((x, col) => {
        makeDesk(x, z)
        const student = makePerson(colors[(row + col) % colors.length], 0.82)
        student.position.set(x, 0, z + 0.58)
        student.rotation.y = Math.PI
        scene.add(student)
      })
    })
  }

  function makeDesk(x, z) {
    box({ x, y: 0.52, z, w: 1.22, h: 0.2, d: 0.78, color: PALETTE.wood, collide: true })
    for (const dx of [-0.48, 0.48]) for (const dz of [-0.28, 0.28]) leg(x + dx, 0.26, z + dz, 0.52, PALETTE.wood)
    box({ x, y: 0.28, z: z + 0.56, w: 0.86, h: 0.12, d: 0.18, color: 0x7b5a3b, collide: true })
  }

  function makePerson(color, scale = 1) {
    const group = new THREE.Group()
    const body = new THREE.Mesh(sharedBox, material(color))
    body.scale.set(0.46 * scale, 0.7 * scale, 0.34 * scale)
    body.position.y = 0.78 * scale
    const head = new THREE.Mesh(sharedHead, material(PALETTE.rose))
    head.scale.setScalar(scale)
    head.position.y = 1.28 * scale
    const hair = new THREE.Mesh(sharedBox, material(PALETTE.ink))
    hair.scale.set(0.34 * scale, 0.12 * scale, 0.28 * scale)
    hair.position.y = 1.47 * scale
    group.add(body, head, hair)
    return group
  }

  function tick() {
    raf = requestAnimationFrame(tick)
    const dt = Math.min(clock.getDelta(), 0.033)
    if (controlsEnabled) updateMovement(dt)
    updateHeight(dt)
    updateCameraZoom(dt)
    updateNearBoard()
    applyLook()
    renderer.render(scene, camera)
  }

  function applyLook() {
    camera.rotation.order = 'YXZ'
    camera.rotation.set(pitch, yaw, 0)
  }

  function updateMovement(dt) {
    let side = 0
    let ahead = 0
    if (keys.has('KeyW') || keys.has('ArrowUp')) ahead += 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) ahead -= 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) side -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) side += 1
    side += touchMove.x
    ahead -= touchMove.y

    forward.set(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize()
    right.set(Math.cos(yaw), 0, -Math.sin(yaw)).normalize()

    const desired = candidate.set(0, 0, 0)
    desired.addScaledVector(forward, ahead)
    desired.addScaledVector(right, side)
    if (desired.lengthSq() > 1) desired.normalize()

    const crouching = keys.has('ControlLeft') || keys.has('ControlRight')
    const sprinting = !crouching && (keys.has('ShiftLeft') || keys.has('ShiftRight'))
    const speed = crouching ? 1.55 : sprinting ? 5.1 : 3.2
    velocity.x += (desired.x * speed - velocity.x) * Math.min(1, dt * 9)
    velocity.z += (desired.z * speed - velocity.z) * Math.min(1, dt * 9)
    velocity.multiplyScalar(0.94)

    moveAxis('x', velocity.x * dt)
    moveAxis('z', velocity.z * dt)
  }

  function updateHeight(dt) {
    const crouching = keys.has('ControlLeft') || keys.has('ControlRight')
    const targetHeight = crouching ? CROUCH_HEIGHT : STAND_HEIGHT
    if (!grounded || jumpVelocity > 0) {
      camera.position.y += jumpVelocity * dt
      jumpVelocity -= 10.5 * dt
      if (camera.position.y <= targetHeight) {
        camera.position.y = targetHeight
        jumpVelocity = 0
        grounded = true
      }
    } else {
      camera.position.y += (targetHeight - camera.position.y) * Math.min(1, dt * 12)
      grounded = Math.abs(camera.position.y - targetHeight) < 0.03
    }
  }

  function updateCameraZoom(dt) {
    const desired = zoomHeld ? ZOOM_FOV : targetFov
    camera.fov += (desired - camera.fov) * Math.min(1, dt * 14)
    camera.updateProjectionMatrix()
  }

  function moveAxis(axis, delta) {
    if (!delta) return
    const previous = camera.position[axis]
    camera.position[axis] += delta
    camera.position.x = clamp(camera.position.x, -ROOM.halfX + PLAYER_RADIUS + 0.15, ROOM.halfX - PLAYER_RADIUS - 0.15)
    camera.position.z = clamp(camera.position.z, -ROOM.halfZ + PLAYER_RADIUS + 0.25, ROOM.halfZ - PLAYER_RADIUS - 0.15)
    if (hitsFurniture(camera.position.x, camera.position.z)) {
      camera.position[axis] = previous
      velocity[axis] = 0
    }
  }

  function hitsFurniture(x, z) {
    return colliders.some((c) => Math.abs(x - c.x) < c.halfX && Math.abs(z - c.z) < c.halfZ)
  }

  function updateNearBoard() {
    const dx = camera.position.x - BOARD_POS.x
    const dz = camera.position.z - BOARD_POS.z
    const near = Math.hypot(dx, dz) <= 2.15 && Math.abs(camera.position.x) <= 3.3
    if (near !== nearBoard) {
      nearBoard = near
      onNearBoard?.(near)
    }
  }

  function resize() {
    const width = mount.clientWidth || window.innerWidth || 360
    const height = mount.clientHeight || window.innerHeight || 640
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, true)
  }

  function dispose() {
    cancelAnimationFrame(raf)
    window.clearTimeout(flashTimer)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('resize', onResize)
    renderer.domElement.removeEventListener('click', onCanvasClick)
    renderer.domElement.removeEventListener('contextmenu', onContextMenu)
    renderer.domElement.removeEventListener('mousedown', onMouseDown)
    renderer.domElement.removeEventListener('mouseup', onMouseUp)
    renderer.domElement.removeEventListener('mouseleave', onMouseUp)
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mousemove', onMouseMove)
    mount.removeEventListener('pointerdown', onPointerDown)
    mount.removeEventListener('pointermove', onPointerMove)
    mount.removeEventListener('pointerup', onPointerEnd)
    mount.removeEventListener('pointercancel', onPointerEnd)
    mount.removeEventListener('wheel', onWheel)
    if (document.pointerLockElement === renderer.domElement) document.exitPointerLock?.()
    disposables.forEach((resource) => resource.dispose?.())
    renderer.dispose()
    renderer.forceContextLoss?.()
    renderer.domElement.remove()
  }

  function hasActiveTouch() {
    return touchState.size > 0
  }
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }

  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}








