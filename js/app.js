/**
 * app.js
 *
 * Presentation Layer
 * - Project rendering
 * - Project overview
 * - Category filtering
 * - Dynamic modal
 * - Loading / empty / error states
 */

(function () {

    'use strict';


    /* =====================================================
       APPLICATION STATE
    ===================================================== */

    const state = {

        projects: [],

        activeFilter: 'all'

    };


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const els = {

        loading:
            document.getElementById('projectsLoading'),

        error:
            document.getElementById('projectsError'),

        empty:
            document.getElementById('projectsEmpty'),

        container:
            document.getElementById('projectsContainer'),

        overview:
            document.getElementById('projectOverview'),

        filterButtons:
            document.querySelectorAll(
                '#categoryFilters .filter-btn'
            ),

        modalTitle:
            document.getElementById(
                'universalProjectModalLabel'
            ),

        modalBody:
            document.getElementById(
                'universalProjectModalBody'
            )

    };


    /* =====================================================
       SECURITY
    ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement('div');

        div.textContent =
            String(value ?? '');

        return div.innerHTML;
    }


    /* =====================================================
       PROJECT OVERVIEW
    ===================================================== */

    function renderProjectOverview(projects) {

        if (!els.overview) {
            return;
        }

        els.overview.innerHTML = '';

        if (!projects.length) {

            els.overview.innerHTML = `
                <div class="overview-loading">
                    <span>Tidak ada data proyek.</span>
                </div>
            `;

            return;
        }


        projects.forEach((project, index) => {

            const card =
                document.createElement('article');

            card.className =
                'overview-card';

            const tools =
                project.tags
                    .map(
                        tag =>
                            `<span>${escapeHTML(tag)}</span>`
                    )
                    .join('');


            card.innerHTML = `

                <div class="overview-number">
                    ${String(index + 1).padStart(2, '0')}
                </div>

                <h3>
                    ${escapeHTML(project.title)}
                </h3>

                <p>
                    ${escapeHTML(project.description)}
                </p>

                <div class="overview-tools">
                    ${tools}
                </div>

            `;


            /* Clicking overview opens project modal */

            card.addEventListener(
                'click',
                () => {

                    openProjectModal(project.id);

                    const modalElement =
                        document.getElementById(
                            'universalProjectModal'
                        );

                    if (modalElement &&
                        window.bootstrap) {

                        const modal =
                            bootstrap.Modal.getOrCreateInstance(
                                modalElement
                            );

                        modal.show();
                    }

                }
            );


            card.style.cursor = 'pointer';

            els.overview.appendChild(card);

        });

    }


    /* =====================================================
       PROJECT CARD
    ===================================================== */

    function renderProjectCard(project) {

        const tagsHTML =
            project.tags
                .map(
                    tag =>
                        `<span class="tool-chip">
                            ${escapeHTML(tag)}
                        </span>`
                )
                .join('');


        const col =
            document.createElement('div');

        col.className =
            'project-card-wrapper';


        col.innerHTML = `

            <article class="project-card">

                <div
                    class="project-banner
                    ${escapeHTML(project.color)}"
                >

                    <i
                        class="bi
                        ${escapeHTML(project.icon)}"
                    ></i>

                </div>


                <div class="card-body">

                    <span class="project-badge">
                        ${escapeHTML(
                            project.categoryLabel
                        )}
                    </span>


                    <h3 class="card-title">
                        ${escapeHTML(
                            project.title
                        )}
                    </h3>


                    <p class="card-text">
                        ${escapeHTML(
                            project.description
                        )}
                    </p>


                    <div>
                        ${tagsHTML}
                    </div>


                    <button
                        type="button"
                        class="btn-brand-outline"
                        data-project-id="${project.id}"
                    >
                        View Project
                        <i class="bi bi-arrow-up-right ms-1"></i>
                    </button>

                </div>

            </article>

        `;


        return col;

    }


    /* =====================================================
       PROJECT LIST
    ===================================================== */

    function renderProjects() {

        if (!els.container) {
            return;
        }


        const filtered =
            state.activeFilter === 'all'

                ? state.projects

                : state.projects.filter(
                    project =>
                        project.category ===
                        state.activeFilter
                );


        els.container.innerHTML = '';


        /* EMPTY STATE */

        if (!filtered.length) {

            els.empty.classList.remove(
                'd-none'
            );

            return;
        }


        els.empty.classList.add(
            'd-none'
        );


        /* CREATE DOCUMENT FRAGMENT */

        const fragment =
            document.createDocumentFragment();


        filtered.forEach(project => {

            fragment.appendChild(
                renderProjectCard(project)
            );

        });


        els.container.appendChild(
            fragment
        );

    }


    /* =====================================================
       PROJECT MODAL
    ===================================================== */

    function openProjectModal(projectId) {

        const project =
            state.projects.find(
                item =>
                    item.id === Number(projectId)
            );


        if (!project) {
            return;
        }


        els.modalTitle.textContent =
            project.title;


        const tools =
            project.tags
                .map(
                    tag =>
                        `<span class="tool-chip">
                            ${escapeHTML(tag)}
                        </span>`
                )
                .join('');


        els.modalBody.innerHTML = `

            <span class="project-badge">
                ${escapeHTML(
                    project.categoryLabel
                )}
            </span>


            <div class="mt-3">

                <p>
                    ${escapeHTML(
                        project.description
                    )}
                </p>


                <p>
                    <strong>
                        Tools
                    </strong>
                </p>

                <div>
                    ${tools}
                </div>

            </div>

        `;

    }


    /* =====================================================
       FILTER
    ===================================================== */

    function bindFilterButtons() {

        els.filterButtons.forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    els.filterButtons.forEach(
                        btn =>
                            btn.classList.remove(
                                'active'
                            )
                    );


                    button.classList.add(
                        'active'
                    );


                    state.activeFilter =
                        button.dataset.filter;


                    renderProjects();

                }
            );

        });

    }


    /* =====================================================
       MODAL EVENT DELEGATION
    ===================================================== */

    function bindModalTrigger() {

        if (!els.container) {
            return;
        }


        els.container.addEventListener(
            'click',
            event => {

                const button =
                    event.target.closest(
                        '[data-project-id]'
                    );


                if (!button) {
                    return;
                }


                const projectId =
                    button.dataset.projectId;


                openProjectModal(
                    projectId
                );

            }
        );

    }


    /* =====================================================
       STATS
    ===================================================== */

    function fillStats(profile) {

        const semester =
            document.getElementById(
                'statSemester'
            );

        const projects =
            document.getElementById(
                'statProjects'
            );

        const focus =
            document.getElementById(
                'statFocus'
            );

        const workflow =
            document.getElementById(
                'statWorkflow'
            );


        if (semester) {

            semester.textContent =
                profile.stats.semester;

        }


        if (projects) {

            projects.textContent =
                state.projects.length;

        }


        if (focus) {

            focus.textContent =
                profile.focusAreas.length;

        }


        if (workflow) {

            workflow.textContent =
                profile.workflow.length;

        }

    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    async function init() {

        /* Show loading */

        if (els.loading) {

            els.loading.classList.remove(
                'd-none'
            );

        }


        if (els.error) {

            els.error.classList.add(
                'd-none'
            );

        }


        if (els.empty) {

            els.empty.classList.add(
                'd-none'
            );

        }


        try {

            /*
             * Load profile and projects
             * through ApiService.
             */

            const [
                profile,
                projects
            ] = await Promise.all([

                ApiService.fetchProfile(),

                ApiService.fetchProjects()

            ]);


            /* Save projects */

            state.projects =
                projects;


            /* Fill statistics */

            fillStats(
                profile
            );


            /* Render overview */

            renderProjectOverview(
                state.projects
            );


            /* Render project cards */

            renderProjects();


            /* Filters */

            bindFilterButtons();


            /* Modal */

            bindModalTrigger();


        } catch (error) {

            console.error(
                '[Portfolio Error]',
                error
            );


            if (els.error) {

                els.error.classList.remove(
                    'd-none'
                );

            }

        } finally {

            if (els.loading) {

                els.loading.classList.add(
                    'd-none'
                );

            }

        }

    }


    /* =====================================================
       START APPLICATION
    ===================================================== */

    document.addEventListener(
        'DOMContentLoaded',
        init
    );

})();