/**
 * ========================================
 * ARMONÍA AMIGO LANDING PAGE - JAVASCRIPT
 * ========================================
 *
 * Features:
 * - Scroll animations with Intersection Observer
 * - Impact cards carousel with touch support
 * - Number counter animation for statistics
 * - Smooth scrolling
 * - Typewriter reset on scroll
 *
 * CUSTOMIZE: Search for "CUSTOMIZE" comments to find areas to modify
 */

document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // SCROLL ANIMATIONS
  // ========================================

  /**
   * Initialize scroll-triggered animations using Intersection Observer
   * Elements with .armonia-animate-on-scroll class will fade in when visible
   */
  function initScrollAnimations() {
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
            .armonia-section-label,
            .armonia-section-title,
            .armonia-intro-text,
            .armonia-contribution-badge,
            .armonia-meaning-image-wrapper,
            .armonia-impact-card,
            .armonia-quote,
            .armonia-benefit-item,
            .armonia-belief-card,
            .armonia-stat-card,
            .armonia-banner-content,
            .armonia-connect-link
        `)

    // Add animation class to all elements
    animateElements.forEach((el) => {
      el.classList.add("armonia-animate-on-scroll")
    })

    // Create observer
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("armonia-visible")
        }
      })
    }, observerOptions)

    // Observe all elements
    animateElements.forEach((el) => observer.observe(el))
  }

  // ========================================
  // IMPACT CAROUSEL
  // ========================================

  /**
   * Initialize the impact cards carousel with touch and button navigation
   * CUSTOMIZE: Adjust scroll behavior in carouselOptions
   */
  function initImpactCarousel() {
    const carousel = document.getElementById("armonia-impact-carousel")
    const prevBtn = document.getElementById("armonia-carousel-prev")
    const nextBtn = document.getElementById("armonia-carousel-next")
    const indicatorsContainer = document.getElementById("armonia-carousel-indicators")

    if (!carousel) return

    const cards = carousel.querySelectorAll(".armonia-impact-card")
    const totalCards = cards.length
    let currentIndex = 0
    let isScrolling = false

    // Create indicator dots
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement("button")
      dot.classList.add("armonia-carousel-dot")
      if (i === 0) dot.classList.add("armonia-active")
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`)
      dot.addEventListener("click", () => scrollToCard(i))
      indicatorsContainer.appendChild(dot)
    }

    const dots = indicatorsContainer.querySelectorAll(".armonia-carousel-dot")

    // Update active indicator
    function updateIndicators(index) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("armonia-active", i === index)
      })
    }

    // Scroll to specific card
    function scrollToCard(index) {
      if (isScrolling) return
      isScrolling = true

      const card = cards[index]
      if (card) {
        const scrollLeft = card.offsetLeft - carousel.offsetLeft
        carousel.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        })
        currentIndex = index
        updateIndicators(index)
      }

      setTimeout(() => {
        isScrolling = false
      }, 500)
    }

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1
        scrollToCard(newIndex)
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const newIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0
        scrollToCard(newIndex)
      })
    }

    // Update indicators on scroll
    carousel.addEventListener("scroll", () => {
      if (isScrolling) return

      const scrollLeft = carousel.scrollLeft
      const cardWidth = cards[0].offsetWidth + Number.parseInt(getComputedStyle(carousel).gap)
      const newIndex = Math.round(scrollLeft / cardWidth)

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalCards) {
        currentIndex = newIndex
        updateIndicators(currentIndex)
      }
    })

    // Touch support for mobile
    let touchStartX = 0
    let touchEndX = 0

    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    carousel.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        handleSwipe()
      },
      { passive: true },
    )

    function handleSwipe() {
      const swipeThreshold = 50
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentIndex < totalCards - 1) {
          // Swipe left - next card
          scrollToCard(currentIndex + 1)
        } else if (diff < 0 && currentIndex > 0) {
          // Swipe right - previous card
          scrollToCard(currentIndex - 1)
        }
      }
    }
  }

  // ========================================
  // NUMBER COUNTER ANIMATION
  // ========================================

  /**
   * Animate statistics numbers when they come into view
   * Uses easeOutQuart for smooth deceleration
   */
  function initNumberCounters() {
    const statNumbers = document.querySelectorAll(".armonia-stat-number[data-target]")

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    statNumbers.forEach((el) => observer.observe(el))

    function animateNumber(element) {
      const target = Number.parseInt(element.dataset.target)
      const duration = 2500 // CUSTOMIZE: Animation duration in ms
      const startTime = performance.now()

      // Format number with commas or abbreviations
      function formatNumber(num) {
        if (num >= 1000000) {
          return (num / 1000000).toFixed(0) + "M"
        }
        return num.toLocaleString("en-US")
      }

      // Easing function for smooth animation
      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4)
      }

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutQuart(progress)
        const currentValue = Math.floor(easedProgress * target)

        element.textContent = formatNumber(currentValue)

        if (progress < 1) {
          requestAnimationFrame(updateNumber)
        } else {
          element.textContent = formatNumber(target)
        }
      }

      requestAnimationFrame(updateNumber)
    }
  }

  // ========================================
  // SMOOTH SCROLL
  // ========================================

  /**
   * Enable smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href")
        if (targetId === "#") return

        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          e.preventDefault()
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  }

  // ========================================
  // SCROLL INDICATOR
  // ========================================

  /**
   * Hide scroll indicator when user scrolls down
   */
  function initScrollIndicator() {
    const scrollIndicator = document.querySelector(".armonia-scroll-indicator")
    if (!scrollIndicator) return

    let hidden = false

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 100 && !hidden) {
          scrollIndicator.style.opacity = "0"
          scrollIndicator.style.pointerEvents = "none"
          hidden = true
        } else if (window.scrollY <= 100 && hidden) {
          scrollIndicator.style.opacity = "0.8"
          scrollIndicator.style.pointerEvents = "auto"
          hidden = false
        }
      },
      { passive: true },
    )
  }

  // ========================================
  // PARALLAX EFFECT (subtle)
  // ========================================

  /**
   * Add subtle parallax effect to hero background
   * CUSTOMIZE: Adjust parallax intensity with the multiplier
   */
  function initParallax() {
    const hero = document.querySelector(".armonia-hero")
    if (!hero) return

    // Only enable on non-mobile for performance
    if (window.innerWidth < 768) return

    window.addEventListener(
      "scroll",
      () => {
        const scrolled = window.scrollY
        const parallaxValue = scrolled * 0.3 // CUSTOMIZE: Parallax intensity
        hero.style.backgroundPositionY = `calc(50% + ${parallaxValue}px)`
      },
      { passive: true },
    )
  }

  // ========================================
  // TYPEWRITER RESET
  // ========================================

  /**
   * Reset typewriter animation when hero comes back into view
   */
  function initTypewriterReset() {
    const typewriter = document.querySelector(".armonia-typewriter")
    if (!typewriter) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset animation by toggling class
            typewriter.style.animation = "none"
            typewriter.offsetHeight // Force reflow
            typewriter.style.animation = ""
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(typewriter)
  }

  // ========================================
  // INITIALIZE ALL FEATURES
  // ========================================

  initScrollAnimations()
  initImpactCarousel()
  initNumberCounters()
  initSmoothScroll()
  initScrollIndicator()
  initParallax()
  initTypewriterReset()

  // Log initialization (remove in production)
  console.log("[Armonía] Landing page initialized successfully")
})
