'use strict'

//Elements
const mainElem = document.getElementsByTagName('main')[0]
const filterContainerElem = document.getElementsByClassName('filter__categories')[0]
const filterBtnClearElem = document.getElementsByClassName('filter__btn-clear')[0]
const filterElem = document.getElementsByClassName('filter')[0]

//Listeners
filterBtnClearElem.addEventListener('click', clearFilters)

//Variables
let filters = []

//Functions
function displayJobs(filters) {
    mainElem.innerHTML = ''
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            //verify if theres a filter active to remove from {data}
            if (filters.length != 0) {
                data = data.filter((job) => {
                    let jobRequirements = job.tools.concat(job.languages)
                    jobRequirements.push(job.role)
                    jobRequirements.push(job.level)
                    return filters.every(filter => jobRequirements.includes(filter))
                })
            }
            //creating every job card
            data.forEach(element => {
                //put together all variables that we use as filters 
                let requirements = element.tools.concat(element.languages)
                requirements.push(element.role)
                requirements.push(element.level)
                //put all requirement templates inside a variable to display on this job card
                let requirementsTemplate = ''
                for (let i = 0; i < requirements.length; i++) {
                    requirementsTemplate +=
                        `<div class="job__requirement">${requirements[i]}</div>`
                }
                //verify if is new and featured
                let badges = ''
                if (element.new) {
                    badges += `<p class="job__badge --new">NEW!</p>`
                }
                if (element.featured) {
                    badges += `<p class="job__badge --featured">FEATURED</p>`
                }

                //verify if job card is new and featured to add the class 'isNewAndFeatured' that draws a border in the left side of the card
                let isNewAndFeatured = element.new && element.featured ? 'isNewAndFeatured' : ''

                //creating job card
                mainElem.innerHTML +=
                    `
                    <div class="job ${isNewAndFeatured}">
                    <img src="${element.logo}" alt="" class="job__logo">
                    <div class="job__info">
                    <div class="job__badges">
                    <p class="job__company">${element.company}</p>
                    ${badges}
                    </div>
                    <h1 class="job__position">${element.position}</h1>
                    <ul>
                    <li class="job__postedAt">${element.postedAt}</li>
                    <li class="job__contract">${element.contract}</li>
                    <li class="job__location">${element.location}</li>
                    </ul>
                    </div>
                    <hr>
                    <div class="job__requirements">
                        ${requirementsTemplate}
                    </div>
                    </div>
                    `
            });
            //creating eventlisteners for each job requirement that will put inside filter container when clicked
            let btnElements = document.getElementsByClassName('job__requirement')
            for (let i = 0; i < btnElements.length; i++) {
                const element = btnElements[i];
                const addFilter = () => {
                    if (!filters.includes(element.outerText)) {
                        filters.push(element.outerText)
                        displayJobs(filters)
                        displayFilters()
                    }
                }
                element.removeEventListener('click', addFilter)
                element.addEventListener('click', addFilter)
            }
        })
}
/**
 * Displays filter badges inside filters box and sets a function to remove self and from {filters} variable when clicked
 */
function displayFilters() {
    filterElem.classList.remove('hidden')
    filterContainerElem.innerHTML = ''
    filters.forEach(element => {
        filterContainerElem.innerHTML +=
            `<div class="filter__categories-filter">
            <p>${element}</p>
            <div onclick="removeFilter(this)"></div>
            </div>`
    })
    setMainPaddingTop()
}
/**
 * Remove filter element where was called
 */
function removeFilter(HTMLElement) {
    filters = filters.filter(filter => {
        if (filter == HTMLElement.parentNode.firstElementChild.outerText) {
            return false
        } else {
            return true
        }
    })
    HTMLElement.parentNode.remove()
    if (filters == 0) {
        filterElem.classList.add('hidden')
        setMainPaddingTop()
    }
    displayJobs(filters)
}
/**
 * Delete all filter elements from filter box
 */
function clearFilters() {
    filters = []
    filterContainerElem.innerHTML = ''
    filterElem.classList.add('hidden')
    displayJobs(filters)
    setMainPaddingTop()
}
/**
 * Sets padding top of main depending of filterContainer size
 */
function setMainPaddingTop() {
    let height = filterElem.clientHeight
    mainElem.style.paddingTop = `${height / 2}px`
}

//OnLoad
displayJobs(filters)