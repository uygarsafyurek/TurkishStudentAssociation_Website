import './style.css'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const photoFilm = document.querySelector('.photo-film')
const photoRail = document.querySelector('.photo-film__track')
const photoSet = photoRail?.querySelector('.photo-film__set')
const previousPhotosButton = document.querySelector('.photo-film__arrow--previous')
const nextPhotosButton = document.querySelector('.photo-film__arrow--next')

if (
  photoFilm instanceof HTMLElement &&
  photoRail instanceof HTMLElement &&
  photoSet instanceof HTMLElement &&
  previousPhotosButton instanceof HTMLButtonElement &&
  nextPhotosButton instanceof HTMLButtonElement
) {
  if (!prefersReducedMotion) {
    const duplicateSet = photoSet.cloneNode(true)
    if (duplicateSet instanceof HTMLElement) {
      duplicateSet.setAttribute('aria-hidden', 'true')
      duplicateSet.querySelectorAll('[role]').forEach((element) => element.removeAttribute('role'))
      duplicateSet.querySelectorAll('img').forEach((image) => image.setAttribute('alt', ''))
      photoRail.append(duplicateSet)
    }
  }

  const movePhotos = (direction) => {
    const firstPhoto = photoRail.querySelector('.film-photo')
    const gap = Number.parseFloat(getComputedStyle(photoRail).columnGap) || 0
    const distance = firstPhoto instanceof HTMLElement
      ? firstPhoto.getBoundingClientRect().width + gap
      : photoRail.clientWidth * 0.8

    if (!prefersReducedMotion) {
      const animation = photoRail.getAnimations()[0]
      const duration = animation?.effect?.getTiming().duration
      const setWidth = photoSet.getBoundingClientRect().width

      if (animation && typeof duration === 'number' && setWidth > 0) {
        const currentTime = typeof animation.currentTime === 'number' ? animation.currentTime : 0
        const offset = direction * duration * distance / setWidth
        animation.currentTime = ((currentTime + offset) % duration + duration) % duration
        return
      }
    }

    photoRail.scrollBy({
      left: direction * distance,
      behavior: 'auto',
    })
  }

  previousPhotosButton.addEventListener('click', () => movePhotos(-1))
  nextPhotosButton.addEventListener('click', () => movePhotos(1))
}

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  document.body.classList.add('js-scroll-reveal')

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      }
    },
    { threshold: 0.18 },
  )

  document.querySelectorAll('.scroll-reveal').forEach((element) => {
    revealObserver.observe(element)
  })
}
