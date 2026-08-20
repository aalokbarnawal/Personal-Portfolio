/**
 * Aalok Barnawal — Admin Dashboard Logic
 * Handles Authentication, Firestore operations, Cloudinary image upload, and dynamic UI management.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // State
  let currentPortfolioData = null;
  let activeTab = "tab-hero";

  // Elements
  const authScreen = document.getElementById("auth-screen");
  const adminDashboard = document.getElementById("admin-dashboard");
  const loginForm = document.getElementById("login-form");
  const btnLogout = document.getElementById("btn-logout");
  const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const currentTabTitle = document.getElementById("current-tab-title");
  const mobileSidebarToggle = document.getElementById("mobile-sidebar-toggle");
  const adminSidebar = document.querySelector(".admin-sidebar");
  const btnSaveAll = document.getElementById("btn-save-all");

  // =========================================================
  // 1. AUTHENTICATION
  // =========================================================
  initFirebase();

  function showDashboard() {
    if (authScreen) authScreen.classList.add("hidden");
    if (adminDashboard) adminDashboard.classList.remove("hidden");
  }

  function showAuthScreen() {
    if (authScreen) authScreen.classList.remove("hidden");
    if (adminDashboard) adminDashboard.classList.add("hidden");
  }

  if (firebaseAuth) {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        showDashboard();
        loadAndPopulateData();
      } else {
        showAuthScreen();
      }
    });
  } else {
    showAuthScreen();
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("auth-email").value.trim();
      const password = document.getElementById("auth-password").value;
      const btnLogin = document.getElementById("btn-login");

      if (btnLogin) {
        btnLogin.classList.add("loading");
        btnLogin.querySelector(".btn-text").textContent = "Signing In...";
      }

      try {
        if (!firebaseAuth) {
          throw new Error("Firebase Auth is not available.");
        }
        await firebaseAuth.signInWithEmailAndPassword(email, password);
        showToast("Signed in successfully!", "success");
      } catch (err) {
        console.error("Auth error:", err);
        showToast(
          err.message || "Failed to sign in. Check email & password.",
          "error",
        );
      } finally {
        if (btnLogin) {
          btnLogin.classList.remove("loading");
          btnLogin.querySelector(".btn-text").textContent = "Sign In";
        }
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      if (firebaseAuth && firebaseAuth.currentUser) {
        await firebaseAuth.signOut();
      }
      showAuthScreen();
      showToast("Signed out.", "success");
    });
  }

  // =========================================================
  // 2. TAB NAVIGATION
  // =========================================================
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab;
      switchTab(targetTab);
    });
  });

  function switchTab(targetTab) {
    activeTab = targetTab;

    navItems.forEach((item) => {
      item.classList.toggle("active", item.dataset.tab === targetTab);
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetTab);
    });

    const activeItem = document.querySelector(
      `.sidebar-nav .nav-item[data-tab="${targetTab}"]`,
    );
    if (activeItem && currentTabTitle) {
      currentTabTitle.textContent =
        activeItem.querySelector("span").textContent;
    }

    if (adminSidebar) adminSidebar.classList.remove("open");
  }

  if (mobileSidebarToggle && adminSidebar) {
    mobileSidebarToggle.addEventListener("click", () => {
      adminSidebar.classList.toggle("open");
    });
  }

  // =========================================================
  // 3. LOAD DATA & POPULATE FORMS
  // =========================================================
  async function loadAndPopulateData() {
    try {
      showToast("Loading portfolio data...", "loading");
      currentPortfolioData = await fetchPortfolioData();

      if (!currentPortfolioData && typeof portfolioSeedData !== "undefined") {
        currentPortfolioData = JSON.parse(JSON.stringify(portfolioSeedData));
      }

      populateFormFields(currentPortfolioData);
      showToast("Data loaded successfully.", "success");
    } catch (err) {
      console.error("Error loading portfolio data:", err);
      showToast("Error loading data from Firestore.", "error");
    }
  }

  function populateFormFields(data) {
    if (!data) return;

    // --- TAB 1: HERO ---
    if (data.hero) {
      setVal("hero-availability", data.hero.availabilityText || "");
      setVal("hero-headline-1", data.hero.headlineLine1 || "");
      setVal("hero-headline-2", data.hero.headlineLine2 || "");
      setVal("hero-headline-3", data.hero.headlineLine3 || "");

      // Clean plain text without raw HTML tags
      const cleanHeroDesc = (data.hero.description || "").replace(
        /<\/?[^>]+(>|$)/g,
        "",
      );
      setVal("hero-description-input", cleanHeroDesc);

      setVal("hero-image-url", data.hero.heroImage || "");
      setVal("photo-label-top-input", data.hero.photoLabelTop || "");
      setVal("photo-label-bottom-input", data.hero.photoLabelBottom || "");

      const preview = document.getElementById("hero-image-preview");
      if (preview && data.hero.heroImage) {
        preview.src = data.hero.heroImage;
      }

      renderTaglinesChips(data.hero.taglines || []);
    }

    // --- TAB 2: ABOUT & STATS ---
    if (data.about) {
      setVal("about-sec-num", data.about.sectionNumber || "");

      // Split section title into Line 1 and Line 2 cleanly
      let line1 = data.about.sectionTitleLine1 || "";
      let line2 = data.about.sectionTitleLine2 || "";
      if (!line1 && data.about.sectionTitle) {
        const parts = data.about.sectionTitle.split(/<br\s*\/?>/i);
        line1 = parts[0] || "";
        line2 = parts[1] || "";
      }
      setVal("about-title-line-1", line1.replace(/<\/?[^>]+(>|$)/g, "").trim());
      setVal("about-title-line-2", line2.replace(/<\/?[^>]+(>|$)/g, "").trim());

      const cleanLead = (data.about.leadText || "").replace(
        /<\/?[^>]+(>|$)/g,
        "",
      );
      setVal("about-lead-text", cleanLead);
      setVal(
        "about-p1",
        (data.about.paragraph1 || "").replace(/<\/?[^>]+(>|$)/g, ""),
      );
      setVal(
        "about-p2",
        (data.about.paragraph2 || "").replace(/<\/?[^>]+(>|$)/g, ""),
      );

      renderStatsEditor(data.about.experienceStats || []);
    }

    // --- TAB 3: WHO I AM ---
    if (data.whoIAm) {
      setVal("whoiam-badge-input", data.whoIAm.badge || "");
      setVal("whoiam-title-input", data.whoIAm.title || "");
      setVal("whoiam-status-input", data.whoIAm.statusText || "");
      setVal("whoiam-name-input", data.whoIAm.name || "");
      setVal("whoiam-primary-input", data.whoIAm.primaryRole || "");
      setVal("whoiam-sec-input", data.whoIAm.secondaryCraft || "");
      setVal("whoiam-focus-input", data.whoIAm.creativeFocus || "");
      setVal("whoiam-avail-input", data.whoIAm.availability || "");

      renderWhoIAmTools(data.whoIAm.coreTools || []);
    }

    // --- TAB 4: SERVICES ---
    renderServicesEditor(data.services || []);

    // --- TAB: SELECTED WORK / PROJECTS ---
    renderProjectsEditor(data.projects || []);

    // --- TAB 5: SKILLS & MARQUEE ---
    if (data.skills) {
      renderSkillsChips("skills-design-chips", data.skills.design || []);
      renderSkillsChips("skills-dev-chips", data.skills.development || []);
      renderMarqueeTools(data.skills.toolsMarquee || []);
    }

    // --- TAB 6: CONTACT & SOCIALS ---
    if (data.contact) {
      setVal("contact-email-input", data.contact.email || "");
      setVal("contact-avail-input", data.contact.availability || "");

      if (data.contact.socials) {
        setVal("social-instagram", data.contact.socials.instagram || "");
        setVal("social-behance", data.contact.socials.behance || "");
        setVal("social-github", data.contact.socials.github || "");
        setVal("social-linkedin", data.contact.socials.linkedin || "");
      }
    }
  }

  function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  // =========================================================
  // 4. DYNAMIC LIST RENDERERS & EDITORS
  // =========================================================

  // --- Taglines ---
  function renderTaglinesChips(taglines) {
    const container = document.getElementById("taglines-list");
    if (!container) return;

    container.innerHTML = taglines
      .map(
        (tag, idx) => `
      <div class="tag-chip">
        <span>${tag}</span>
        <button type="button" class="tag-chip-remove" data-index="${idx}" aria-label="Remove">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`,
      )
      .join("");

    container.querySelectorAll(".tag-chip-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (currentPortfolioData?.hero?.taglines) {
          currentPortfolioData.hero.taglines.splice(idx, 1);
          renderTaglinesChips(currentPortfolioData.hero.taglines);
        }
      });
    });
  }

  const btnAddTagline = document.getElementById("btn-add-tagline");
  const newTaglineInput = document.getElementById("new-tagline-input");
  if (btnAddTagline && newTaglineInput) {
    btnAddTagline.addEventListener("click", () => {
      const val = newTaglineInput.value.trim();
      if (val) {
        if (!currentPortfolioData.hero) currentPortfolioData.hero = {};
        if (!currentPortfolioData.hero.taglines)
          currentPortfolioData.hero.taglines = [];
        currentPortfolioData.hero.taglines.push(val);
        renderTaglinesChips(currentPortfolioData.hero.taglines);
        newTaglineInput.value = "";
      }
    });
  }

  // --- Experience Stats ---
  function renderStatsEditor(stats) {
    const container = document.getElementById("stats-editor-list");
    if (!container) return;

    container.innerHTML = stats
      .map(
        (stat, idx) => `
      <div class="stat-edit-item" data-index="${idx}">
        <div class="form-row">
          <div class="form-group">
            <label>Target Number</label>
            <input type="number" class="stat-input-num" value="${stat.number}" />
          </div>
          <div class="form-group">
            <label>Suffix</label>
            <input type="text" class="stat-input-suffix" value="${stat.suffix || "+"}" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Label</label>
            <input type="text" class="stat-input-label" value="${stat.label}" />
          </div>
          <div class="form-group">
            <label>FA Icon Class</label>
            <input type="text" class="stat-input-icon" value="${stat.icon || "fa-solid fa-star"}" />
          </div>
        </div>
      </div>`,
      )
      .join("");
  }

  // --- Who I Am Tools ---
  function renderWhoIAmTools(tools) {
    const container = document.getElementById("whoiam-tools-list");
    if (!container) return;

    container.innerHTML = tools
      .map(
        (tool, idx) => `
      <div class="dynamic-item-row">
        <i class="${tool.icon || "fa-solid fa-cube"}"></i>
        <span><strong>${tool.name}</strong> <small style="color: #666; margin-left: 8px;">(${tool.icon})</small></span>
        <button type="button" class="tag-chip-remove btn-remove-whoiam-tool" data-index="${idx}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>`,
      )
      .join("");

    container.querySelectorAll(".btn-remove-whoiam-tool").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (currentPortfolioData?.whoIAm?.coreTools) {
          currentPortfolioData.whoIAm.coreTools.splice(idx, 1);
          renderWhoIAmTools(currentPortfolioData.whoIAm.coreTools);
        }
      });
    });
  }

  const btnAddWhoTool = document.getElementById("btn-add-whoiam-tool");
  const newWhoToolName = document.getElementById("new-whoiam-tool-name");
  const newWhoToolIcon = document.getElementById("new-whoiam-tool-icon");
  if (btnAddWhoTool && newWhoToolName && newWhoToolIcon) {
    btnAddWhoTool.addEventListener("click", () => {
      const name = newWhoToolName.value.trim();
      const icon = newWhoToolIcon.value.trim() || "fa-solid fa-cube";
      if (name) {
        if (!currentPortfolioData.whoIAm) currentPortfolioData.whoIAm = {};
        if (!currentPortfolioData.whoIAm.coreTools)
          currentPortfolioData.whoIAm.coreTools = [];
        currentPortfolioData.whoIAm.coreTools.push({ name, icon });
        renderWhoIAmTools(currentPortfolioData.whoIAm.coreTools);
        newWhoToolName.value = "";
        newWhoToolIcon.value = "";
      }
    });
  }

  // --- Services ---
  function renderServicesEditor(services) {
    const container = document.getElementById("services-editor-list");
    if (!container) return;

    container.innerHTML = services
      .map(
        (srv, idx) => `
      <div class="service-edit-card" data-index="${idx}">
        <div class="service-card-topbar">
          <span style="font-weight: 700; color: var(--orange);">Card #${idx + 1}</span>
          <button type="button" class="service-card-delete btn-delete-service" data-index="${idx}" title="Delete Card">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Card Number</label>
            <input type="text" class="srv-input-number" value="${srv.number || String(idx + 1).padStart(2, "0")}" />
          </div>
          <div class="form-group">
            <label>FA Icon Class</label>
            <input type="text" class="srv-input-icon" value="${srv.icon || "fa-solid fa-pen-nib"}" />
          </div>
        </div>
        <div class="form-group">
          <label>Service Title</label>
          <input type="text" class="srv-input-title" value="${srv.title}" />
        </div>
        <div class="form-group">
          <label>Service Description</label>
          <textarea class="srv-input-desc" rows="3">${srv.description}</textarea>
        </div>
      </div>`,
      )
      .join("");

    container.querySelectorAll(".btn-delete-service").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (
          currentPortfolioData?.services &&
          currentPortfolioData.services.length > 1
        ) {
          currentPortfolioData.services.splice(idx, 1);
          renderServicesEditor(currentPortfolioData.services);
        } else {
          showToast("You must keep at least 1 service card.", "error");
        }
      });
    });
  }

  function syncServicesFromDOM() {
    const serviceCards = document.querySelectorAll(".service-edit-card");
    if (!serviceCards.length) return;
    const collectedServices = [];
    serviceCards.forEach((card, idx) => {
      collectedServices.push({
        id: `service-${idx + 1}`,
        number:
          card.querySelector(".srv-input-number")?.value ||
          String(idx + 1).padStart(2, "0"),
        icon:
          card.querySelector(".srv-input-icon")?.value || "fa-solid fa-pen-nib",
        title: card.querySelector(".srv-input-title")?.value || "",
        description: card.querySelector(".srv-input-desc")?.value || "",
      });
    });
    if (!currentPortfolioData) currentPortfolioData = {};
    currentPortfolioData.services = collectedServices;
  }

  function syncProjectsFromDOM() {
    const projectCards = document.querySelectorAll(".project-edit-card");
    if (!projectCards.length) return;
    const collectedProjects = [];
    projectCards.forEach((card, idx) => {
      const tagSpans = card.querySelectorAll(
        ".tag-chips-editor .tag-chip span",
      );
      const tools = Array.from(tagSpans).map((s) => s.textContent.trim());

      collectedProjects.push({
        id: `proj-${idx + 1}`,
        title: card.querySelector(".proj-input-title")?.value.trim() || "",
        description: card.querySelector(".proj-input-desc")?.value.trim() || "",
        image:
          card.querySelector(".proj-input-image")?.value.trim() ||
          "images/work-brand-identity.png",
        tools: tools,
        link: card.querySelector(".proj-input-link")?.value.trim() || "",
      });
    });
    if (!currentPortfolioData) currentPortfolioData = {};
    currentPortfolioData.projects = collectedProjects;
  }

  // =========================================================
  // MODAL CONTROLLER (ADD NEW SERVICE)
  // =========================================================
  const serviceModal = document.getElementById("service-modal");
  const btnCloseServiceModal = document.getElementById(
    "btn-close-service-modal",
  );
  const btnCancelServiceModal = document.getElementById(
    "btn-cancel-service-modal",
  );
  const serviceModalBackdrop = document.getElementById(
    "service-modal-backdrop",
  );
  const serviceModalForm = document.getElementById("service-modal-form");
  const modalSrvNumber = document.getElementById("modal-srv-number");
  const modalSrvIcon = document.getElementById("modal-srv-icon");
  const modalSrvIconPreview = document.getElementById("modal-srv-icon-preview");
  const modalSrvTitle = document.getElementById("modal-srv-title");
  const modalSrvDesc = document.getElementById("modal-srv-desc");

  function openServiceModal() {
    if (!serviceModal) return;
    syncServicesFromDOM();
    const count = currentPortfolioData?.services?.length || 0;
    const nextNum = String(count + 1).padStart(2, "0");

    if (modalSrvNumber) modalSrvNumber.value = nextNum;
    if (modalSrvIcon) modalSrvIcon.value = "fa-solid fa-wand-magic-sparkles";
    if (modalSrvIconPreview)
      modalSrvIconPreview.className = "fa-solid fa-wand-magic-sparkles";
    if (modalSrvTitle) modalSrvTitle.value = "";
    if (modalSrvDesc) modalSrvDesc.value = "";

    serviceModal.classList.remove("hidden");
    if (modalSrvTitle) modalSrvTitle.focus();
  }

  function closeServiceModal() {
    if (serviceModal) serviceModal.classList.add("hidden");
  }

  if (modalSrvIcon) {
    modalSrvIcon.addEventListener("input", () => {
      const cls = modalSrvIcon.value.trim() || "fa-solid fa-cube";
      if (modalSrvIconPreview) modalSrvIconPreview.className = cls;
    });
  }

  const btnAddService = document.getElementById("btn-add-service-card");
  if (btnAddService) {
    btnAddService.addEventListener("click", (e) => {
      e.preventDefault();
      openServiceModal();
    });
  }

  if (btnCloseServiceModal)
    btnCloseServiceModal.addEventListener("click", closeServiceModal);
  if (btnCancelServiceModal)
    btnCancelServiceModal.addEventListener("click", closeServiceModal);
  if (serviceModalBackdrop)
    serviceModalBackdrop.addEventListener("click", closeServiceModal);

  if (serviceModalForm) {
    serviceModalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const number = modalSrvNumber.value.trim() || "01";
      const icon =
        modalSrvIcon.value.trim() || "fa-solid fa-wand-magic-sparkles";
      const title = modalSrvTitle.value.trim();
      const description = modalSrvDesc.value.trim();

      if (!title) {
        showToast("Please enter a service title.", "error");
        return;
      }

      syncServicesFromDOM();
      if (!currentPortfolioData) currentPortfolioData = {};
      if (!currentPortfolioData.services) currentPortfolioData.services = [];

      currentPortfolioData.services.push({
        id: `service-${Date.now()}`,
        number,
        icon,
        title,
        description,
      });

      renderServicesEditor(currentPortfolioData.services);
      closeServiceModal();
      showToast(
        "New service added! Click 'Save All Changes' to publish.",
        "success",
      );
    });
  }

  // --- Projects (Selected Work) ---
  function renderProjectsEditor(projects) {
    const container = document.getElementById("projects-editor-list");
    if (!container) return;

    container.innerHTML = projects
      .map((proj, idx) => {
        const tags = Array.isArray(proj.tools)
          ? proj.tools
          : typeof proj.tools === "string"
            ? proj.tools.split(",").map((t) => t.trim())
            : [];

        return `
      <div class="project-edit-card" data-index="${idx}">
        <div class="project-card-header">
          <span style="font-weight: 700; color: var(--orange);">Project #${idx + 1}</span>
          <button type="button" class="service-card-delete btn-delete-project" data-index="${idx}" title="Delete Project">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>

        <div class="form-group">
          <label>Project Preview Image</label>
          <div class="project-img-preview-box" id="project-preview-${idx}">
            ${proj.image ? `<img src="${proj.image}" alt="Preview" />` : `<span class="empty">No image selected</span>`}
          </div>
          <div style="display: flex; gap: 10px; margin-top: 10px; align-items: center;">
            <input type="text" class="proj-input-image" id="proj-img-url-${idx}" value="${proj.image || ""}" placeholder="Image URL or upload..." />
            <label class="project-upload-trigger" for="proj-upload-${idx}">
              <i class="fa-solid fa-cloud-arrow-up"></i> Upload
            </label>
            <input type="file" id="proj-upload-${idx}" class="proj-file-input" data-index="${idx}" accept="image/*" style="display: none;" />
          </div>
        </div>

        <div class="form-group">
          <label>Project Title / Name</label>
          <input type="text" class="proj-input-title" value="${proj.title || ""}" placeholder="e.g. Brand Identity" />
        </div>

        <div class="form-group">
          <label>Small Description</label>
          <textarea class="proj-input-desc" rows="3" placeholder="Brief project summary...">${proj.description || ""}</textarea>
        </div>

        <div class="form-group">
          <label>Tools Used / Categories</label>
          <div id="proj-tags-list-${idx}" class="tag-chips-editor">
            ${tags
              .map(
                (tag, tIdx) => `
              <span class="tag-chip">
                <span>${tag}</span>
                <button type="button" class="tag-chip-remove btn-remove-proj-tag" data-proj="${idx}" data-tag="${tIdx}">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>`,
              )
              .join("")}
          </div>
          <div class="input-inline-add" style="margin-top: 8px;">
            <input type="text" id="new-proj-tag-${idx}" placeholder="Add tool (e.g. Figma, Illustrator)..." />
            <button type="button" class="btn btn-secondary btn-sm btn-add-proj-tag" data-proj="${idx}">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Project Link (URL)</label>
          <input type="url" class="proj-input-link" value="${proj.link || ""}" placeholder="https://..." />
        </div>
      </div>`;
      })
      .join("");

    // Attach Delete Handlers
    container.querySelectorAll(".btn-delete-project").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        syncProjectsFromDOM();
        const idx = parseInt(btn.dataset.index, 10);
        if (
          currentPortfolioData?.projects &&
          currentPortfolioData.projects.length > 1
        ) {
          currentPortfolioData.projects.splice(idx, 1);
          renderProjectsEditor(currentPortfolioData.projects);
        } else {
          showToast("You must keep at least 1 project card.", "error");
        }
      });
    });

    // Attach File Upload Handlers for Cloudinary
    container.querySelectorAll(".proj-file-input").forEach((fileInput) => {
      fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const idx = parseInt(fileInput.dataset.index, 10);
        showToast("Uploading project image to Cloudinary...", "loading");

        try {
          const res = await uploadToCloudinary(file);
          if (res?.url) {
            const urlInput = document.getElementById(`proj-img-url-${idx}`);
            const previewBox = document.getElementById(
              `project-preview-${idx}`,
            );
            if (urlInput) urlInput.value = res.url;
            if (previewBox)
              previewBox.innerHTML = `<img src="${res.url}" alt="Preview" />`;
            if (currentPortfolioData?.projects?.[idx]) {
              currentPortfolioData.projects[idx].image = res.url;
            }
            showToast("Project image uploaded successfully!", "success");
          }
        } catch (err) {
          console.error("Project image upload error:", err);
          showToast(err.message || "Failed to upload image.", "error");
        }
      });
    });

    // Live update image URL preview
    container.querySelectorAll(".proj-input-image").forEach((input) => {
      input.addEventListener("input", () => {
        const idx = input.id.replace("proj-img-url-", "");
        const previewBox = document.getElementById(`project-preview-${idx}`);
        const url = input.value.trim();
        if (previewBox) {
          if (url) {
            previewBox.innerHTML = `<img src="${url}" alt="Preview" />`;
          } else {
            previewBox.innerHTML = `<span class="empty">No image selected</span>`;
          }
        }
      });
    });

    // Attach Tag Remove Handlers
    container.querySelectorAll(".btn-remove-proj-tag").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        syncProjectsFromDOM();
        const pIdx = parseInt(btn.dataset.proj, 10);
        const tIdx = parseInt(btn.dataset.tag, 10);
        if (currentPortfolioData?.projects?.[pIdx]?.tools) {
          currentPortfolioData.projects[pIdx].tools.splice(tIdx, 1);
          renderProjectsEditor(currentPortfolioData.projects);
        }
      });
    });

    // Attach Tag Add Handlers
    container.querySelectorAll(".btn-add-proj-tag").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        syncProjectsFromDOM();
        const pIdx = parseInt(btn.dataset.proj, 10);
        const input = document.getElementById(`new-proj-tag-${pIdx}`);
        const tagVal = input?.value.trim();
        if (tagVal) {
          if (!currentPortfolioData.projects[pIdx].tools) {
            currentPortfolioData.projects[pIdx].tools = [];
          }
          currentPortfolioData.projects[pIdx].tools.push(tagVal);
          renderProjectsEditor(currentPortfolioData.projects);
        }
      });
    });
  }

  // =========================================================
  // MODAL CONTROLLER (ADD NEW PROJECT)
  // =========================================================
  const projectModal = document.getElementById("project-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnCancelModal = document.getElementById("btn-cancel-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const projectModalForm = document.getElementById("project-modal-form");
  const modalImgPreview = document.getElementById("modal-img-preview");
  const modalProjImage = document.getElementById("modal-proj-image");
  const modalProjUpload = document.getElementById("modal-proj-upload");
  const modalProjTitle = document.getElementById("modal-proj-title");
  const modalProjDesc = document.getElementById("modal-proj-desc");
  const modalProjTagsList = document.getElementById("modal-proj-tags-list");
  const modalNewTagInput = document.getElementById("modal-new-tag-input");
  const btnModalAddTag = document.getElementById("btn-modal-add-tag");
  const modalProjLink = document.getElementById("modal-proj-link");

  let modalTools = ["Design", "Branding"];

  function openProjectModal() {
    if (!projectModal) return;
    if (modalProjTitle) modalProjTitle.value = "";
    if (modalProjDesc) modalProjDesc.value = "";
    if (modalProjImage) modalProjImage.value = "";
    if (modalProjLink) modalProjLink.value = "";
    if (modalNewTagInput) modalNewTagInput.value = "";
    if (modalImgPreview)
      modalImgPreview.innerHTML = `<span class="empty">No image selected</span>`;
    modalTools = ["Design", "Branding"];
    renderModalTags();

    projectModal.classList.remove("hidden");
    if (modalProjTitle) modalProjTitle.focus();
  }

  function closeProjectModal() {
    if (projectModal) projectModal.classList.add("hidden");
  }

  function renderModalTags() {
    if (!modalProjTagsList) return;
    modalProjTagsList.innerHTML = modalTools
      .map(
        (tag, idx) => `
      <span class="tag-chip">
        <span>${tag}</span>
        <button type="button" class="tag-chip-remove btn-modal-remove-tag" data-index="${idx}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>`,
      )
      .join("");

    modalProjTagsList
      .querySelectorAll(".btn-modal-remove-tag")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.index, 10);
          modalTools.splice(idx, 1);
          renderModalTags();
        });
      });
  }

  if (btnModalAddTag && modalNewTagInput) {
    btnModalAddTag.addEventListener("click", (e) => {
      e.preventDefault();
      const val = modalNewTagInput.value.trim();
      if (val && !modalTools.includes(val)) {
        modalTools.push(val);
        renderModalTags();
        modalNewTagInput.value = "";
      }
    });
    modalNewTagInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        btnModalAddTag.click();
      }
    });
  }

  if (modalProjUpload) {
    modalProjUpload.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      showToast("Uploading project image to Cloudinary...", "loading");
      try {
        const res = await uploadToCloudinary(file);
        if (res?.url) {
          if (modalProjImage) modalProjImage.value = res.url;
          if (modalImgPreview)
            modalImgPreview.innerHTML = `<img src="${res.url}" alt="Preview" />`;
          showToast("Project image uploaded successfully!", "success");
        }
      } catch (err) {
        showToast(err.message || "Failed to upload image.", "error");
      }
    });
  }

  if (modalProjImage) {
    modalProjImage.addEventListener("input", () => {
      const url = modalProjImage.value.trim();
      if (modalImgPreview) {
        if (url) {
          modalImgPreview.innerHTML = `<img src="${url}" alt="Preview" />`;
        } else {
          modalImgPreview.innerHTML = `<span class="empty">No image selected</span>`;
        }
      }
    });
  }

  const btnAddProject = document.getElementById("btn-add-project-card");
  if (btnAddProject) {
    btnAddProject.addEventListener("click", (e) => {
      e.preventDefault();
      syncProjectsFromDOM();
      openProjectModal();
    });
  }

  if (btnCloseModal) btnCloseModal.addEventListener("click", closeProjectModal);
  if (btnCancelModal)
    btnCancelModal.addEventListener("click", closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeProjectModal);

  if (projectModalForm) {
    projectModalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = modalProjTitle.value.trim();
      const description = modalProjDesc.value.trim();
      const image =
        modalProjImage.value.trim() || "images/work-brand-identity.png";
      const link = modalProjLink.value.trim() || "https://";

      if (!title) {
        showToast("Please enter a project title.", "error");
        return;
      }

      syncProjectsFromDOM();
      if (!currentPortfolioData) currentPortfolioData = {};
      if (!currentPortfolioData.projects) currentPortfolioData.projects = [];

      currentPortfolioData.projects.push({
        id: `proj-${Date.now()}`,
        title,
        description,
        image,
        tools: [...modalTools],
        link,
      });

      renderProjectsEditor(currentPortfolioData.projects);
      closeProjectModal();
      showToast(
        "New project added! Click 'Save All Changes' to publish.",
        "success",
      );
    });
  }

  // --- Skills Chips ---
  function renderSkillsChips(containerId, skillsList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = skillsList
      .map(
        (skill, idx) => `
      <div class="tag-chip">
        <span>${skill}</span>
        <button type="button" class="tag-chip-remove" data-container="${containerId}" data-index="${idx}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`,
      )
      .join("");

    container.querySelectorAll(".tag-chip-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (containerId === "skills-design-chips") {
          currentPortfolioData.skills.design.splice(idx, 1);
          renderSkillsChips(containerId, currentPortfolioData.skills.design);
        } else if (containerId === "skills-dev-chips") {
          currentPortfolioData.skills.development.splice(idx, 1);
          renderSkillsChips(
            containerId,
            currentPortfolioData.skills.development,
          );
        }
      });
    });
  }

  const btnAddDesignSkill = document.getElementById("btn-add-design-skill");
  const newDesignSkillInput = document.getElementById("new-design-skill-input");
  if (btnAddDesignSkill && newDesignSkillInput) {
    btnAddDesignSkill.addEventListener("click", () => {
      const val = newDesignSkillInput.value.trim();
      if (val) {
        if (!currentPortfolioData.skills)
          currentPortfolioData.skills = { design: [], development: [] };
        if (!currentPortfolioData.skills.design)
          currentPortfolioData.skills.design = [];
        currentPortfolioData.skills.design.push(val);
        renderSkillsChips(
          "skills-design-chips",
          currentPortfolioData.skills.design,
        );
        newDesignSkillInput.value = "";
      }
    });
  }

  const btnAddDevSkill = document.getElementById("btn-add-dev-skill");
  const newDevSkillInput = document.getElementById("new-dev-skill-input");
  if (btnAddDevSkill && newDevSkillInput) {
    btnAddDevSkill.addEventListener("click", () => {
      const val = newDevSkillInput.value.trim();
      if (val) {
        if (!currentPortfolioData.skills)
          currentPortfolioData.skills = { design: [], development: [] };
        if (!currentPortfolioData.skills.development)
          currentPortfolioData.skills.development = [];
        currentPortfolioData.skills.development.push(val);
        renderSkillsChips(
          "skills-dev-chips",
          currentPortfolioData.skills.development,
        );
        newDevSkillInput.value = "";
      }
    });
  }

  // --- Marquee Tools ---
  function renderMarqueeTools(tools) {
    const container = document.getElementById("marquee-tools-list");
    if (!container) return;

    container.innerHTML = tools
      .map(
        (tool, idx) => `
      <div class="marquee-tool-chip">
        <div class="tool-info">
          <i class="${tool.icon || "fa-solid fa-cube"}" style="color: var(--orange);"></i>
          <span>${tool.name}</span>
        </div>
        <button type="button" class="tag-chip-remove btn-remove-marquee" data-index="${idx}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>`,
      )
      .join("");

    container.querySelectorAll(".btn-remove-marquee").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (currentPortfolioData?.skills?.toolsMarquee) {
          currentPortfolioData.skills.toolsMarquee.splice(idx, 1);
          renderMarqueeTools(currentPortfolioData.skills.toolsMarquee);
        }
      });
    });
  }

  const btnAddMarquee = document.getElementById("btn-add-marquee-tool");
  const newMarqueeName = document.getElementById("new-marquee-tool-name");
  const newMarqueeIcon = document.getElementById("new-marquee-tool-icon");
  if (btnAddMarquee && newMarqueeName && newMarqueeIcon) {
    btnAddMarquee.addEventListener("click", () => {
      const name = newMarqueeName.value.trim();
      const icon = newMarqueeIcon.value.trim() || "fa-solid fa-cube";
      if (name) {
        if (!currentPortfolioData.skills) currentPortfolioData.skills = {};
        if (!currentPortfolioData.skills.toolsMarquee)
          currentPortfolioData.skills.toolsMarquee = [];
        currentPortfolioData.skills.toolsMarquee.push({ name, icon });
        renderMarqueeTools(currentPortfolioData.skills.toolsMarquee);
        newMarqueeName.value = "";
        newMarqueeIcon.value = "";
      }
    });
  }

  // =========================================================
  // 5. CLOUDINARY IMAGE UPLOADER
  // =========================================================
  const heroImageFile = document.getElementById("hero-image-file");
  const heroDropzone = document.getElementById("hero-dropzone");
  const heroImagePreview = document.getElementById("hero-image-preview");
  const heroImageUrlInput = document.getElementById("hero-image-url");
  const uploadProgressBar = document.getElementById("upload-progress-bar");
  const uploadProgressFill = document.getElementById("upload-progress-fill");

  if (heroImageFile) {
    heroImageFile.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    });
  }

  if (heroDropzone) {
    heroDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      heroDropzone.classList.add("dragover");
    });

    heroDropzone.addEventListener("dragleave", () => {
      heroDropzone.classList.remove("dragover");
    });

    heroDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      heroDropzone.classList.remove("dragover");
      const file = e.dataTransfer?.files?.[0];
      if (file) handleImageUpload(file);
    });
  }

  if (heroImageUrlInput && heroImagePreview) {
    heroImageUrlInput.addEventListener("input", (e) => {
      if (e.target.value.trim()) {
        heroImagePreview.src = e.target.value.trim();
      }
    });
  }

  async function handleImageUpload(file) {
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file (PNG, JPG, WEBP).", "error");
      return;
    }

    // Local instant preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (heroImagePreview) heroImagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Cloudinary upload
    if (uploadProgressBar && uploadProgressFill) {
      uploadProgressBar.classList.remove("hidden");
      uploadProgressFill.style.width = "40%";
    }

    try {
      showToast("Uploading hero image to Cloudinary...", "loading");
      const result = await uploadToCloudinary(file);

      if (uploadProgressFill) uploadProgressFill.style.width = "100%";

      if (result.success && result.url) {
        if (heroImageUrlInput) heroImageUrlInput.value = result.url;
        if (heroImagePreview) heroImagePreview.src = result.url;
        if (!currentPortfolioData.hero) currentPortfolioData.hero = {};
        currentPortfolioData.hero.heroImage = result.url;

        showToast("Image uploaded successfully!", "success");
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      showToast(err.message || "Cloudinary upload failed.", "error");
    } finally {
      setTimeout(() => {
        if (uploadProgressBar) uploadProgressBar.classList.add("hidden");
        if (uploadProgressFill) uploadProgressFill.style.width = "0%";
      }, 1200);
    }
  }

  // =========================================================
  // 6. COLLECT FORM DATA & SAVE TO FIRESTORE
  // =========================================================
  function collectFormData() {
    const payload = JSON.parse(JSON.stringify(currentPortfolioData || {}));

    // --- Hero ---
    if (!payload.hero) payload.hero = {};
    payload.hero.availabilityText = getVal("hero-availability");
    payload.hero.headlineLine1 = getVal("hero-headline-1");
    payload.hero.headlineLine2 = getVal("hero-headline-2");
    payload.hero.headlineLine3 = getVal("hero-headline-3");
    payload.hero.description = getVal("hero-description-input");
    payload.hero.heroImage = getVal("hero-image-url");
    payload.hero.photoLabelTop = getVal("photo-label-top-input");
    payload.hero.photoLabelBottom = getVal("photo-label-bottom-input");

    // --- About ---
    if (!payload.about) payload.about = {};
    payload.about.sectionNumber = getVal("about-sec-num");
    payload.about.sectionTitleLine1 = getVal("about-title-line-1");
    payload.about.sectionTitleLine2 = getVal("about-title-line-2");
    payload.about.sectionTitle = `${payload.about.sectionTitleLine1}<br />${payload.about.sectionTitleLine2}`;
    payload.about.leadText = getVal("about-lead-text");
    payload.about.paragraph1 = getVal("about-p1");
    payload.about.paragraph2 = getVal("about-p2");

    // Stats
    const statCards = document.querySelectorAll(".stat-edit-item");
    const collectedStats = [];
    statCards.forEach((card, idx) => {
      collectedStats.push({
        id: `stat-${idx + 1}`,
        number: parseInt(card.querySelector(".stat-input-num")?.value, 10) || 0,
        suffix: card.querySelector(".stat-input-suffix")?.value || "+",
        label: card.querySelector(".stat-input-label")?.value || "",
        icon:
          card.querySelector(".stat-input-icon")?.value || "fa-solid fa-star",
      });
    });
    if (collectedStats.length > 0)
      payload.about.experienceStats = collectedStats;

    // --- Who I Am ---
    if (!payload.whoIAm) payload.whoIAm = {};
    payload.whoIAm.badge = getVal("whoiam-badge-input");
    payload.whoIAm.title = getVal("whoiam-title-input");
    payload.whoIAm.statusText = getVal("whoiam-status-input");
    payload.whoIAm.name = getVal("whoiam-name-input");
    payload.whoIAm.primaryRole = getVal("whoiam-primary-input");
    payload.whoIAm.secondaryCraft = getVal("whoiam-sec-input");
    payload.whoIAm.creativeFocus = getVal("whoiam-focus-input");
    payload.whoIAm.availability = getVal("whoiam-avail-input");

    // --- Services ---
    const serviceCards = document.querySelectorAll(".service-edit-card");
    const collectedServices = [];
    serviceCards.forEach((card, idx) => {
      collectedServices.push({
        id: `service-${idx + 1}`,
        number:
          card.querySelector(".srv-input-number")?.value ||
          String(idx + 1).padStart(2, "0"),
        icon:
          card.querySelector(".srv-input-icon")?.value || "fa-solid fa-pen-nib",
        title: card.querySelector(".srv-input-title")?.value || "",
        description: card.querySelector(".srv-input-desc")?.value || "",
      });
    });
    if (collectedServices.length > 0) payload.services = collectedServices;

    // --- Projects ---
    const projectCards = document.querySelectorAll(".project-edit-card");
    const collectedProjects = [];
    projectCards.forEach((card, idx) => {
      const tagSpans = card.querySelectorAll(
        ".tag-chips-editor .tag-chip span",
      );
      const tools = Array.from(tagSpans).map((s) => s.textContent.trim());

      collectedProjects.push({
        id: `proj-${idx + 1}`,
        title: card.querySelector(".proj-input-title")?.value.trim() || "",
        description: card.querySelector(".proj-input-desc")?.value.trim() || "",
        image:
          card.querySelector(".proj-input-image")?.value.trim() ||
          "images/work-brand-identity.png",
        tools: tools,
        link: card.querySelector(".proj-input-link")?.value.trim() || "",
      });
    });
    if (collectedProjects.length > 0) payload.projects = collectedProjects;

    // --- Contact ---
    if (!payload.contact) payload.contact = {};
    payload.contact.email = getVal("contact-email-input");
    payload.contact.availability = getVal("contact-avail-input");
    if (!payload.contact.socials) payload.contact.socials = {};
    payload.contact.socials.instagram = getVal("social-instagram");
    payload.contact.socials.behance = getVal("social-behance");
    payload.contact.socials.github = getVal("social-github");
    payload.contact.socials.linkedin = getVal("social-linkedin");

    return payload;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  if (btnSaveAll) {
    btnSaveAll.addEventListener("click", async () => {
      btnSaveAll.classList.add("loading");
      btnSaveAll.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

      try {
        const payload = collectFormData();
        await savePortfolioData(payload);
        currentPortfolioData = payload;
        showToast("All changes saved to Firestore successfully!", "success");
      } catch (err) {
        console.error("Save error:", err);
        showToast(err.message || "Failed to save data to Firestore.", "error");
      } finally {
        btnSaveAll.classList.remove("loading");
        btnSaveAll.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Save All Changes`;
      }
    });
  }

  // =========================================================
  // 7. TOAST NOTIFICATION UTILITY
  // =========================================================
  let toastTimeout = null;
  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    clearTimeout(toastTimeout);

    let icon = "fa-circle-check";
    if (type === "error") icon = "fa-triangle-exclamation";
    if (type === "loading") icon = "fa-spinner fa-spin";

    toast.className = `toast show ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    if (type !== "loading") {
      toastTimeout = setTimeout(() => {
        toast.className = "toast";
      }, 4000);
    }
  }
});
