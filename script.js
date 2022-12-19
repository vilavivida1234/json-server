//Make API CALLS

const Api = (() => {
  const baseUrl = "http://localhost:4232/courseList";

  const getCourses = () => fetch(baseUrl).then((response) => response.json());
  // .then((json) => console.log(json));

  return {
    getCourses,
  };
})();

Api.getCourses();

// VIEW
const View = (() => {
  const domstr = {
    courseList: "#courses_list",
    selectedList: "#selected_list",
  };

  // Create innerHTML
  const createTmp = (arr) => {
    let tmp = "";
    arr.forEach((course) => {
      if (course.required === false) {
        course.courseType = "Compulsory";
      } else {
        course.courseType = "Elective";
      }

      tmp += `
      <li role='option' id = ${course.courseId} data-value=${course.credit}>
          <span>${course.courseName}</span><br/>
          <span>Course Type: ${course.courseType}</span><br/>
          <span>Course Credit:${course.credit}</span> 
      </li>
      `;
    });

    return tmp;
  };

  // Handle user select
  const activateSelection = () => {
    const ul = document.getElementById("courses_list");
    const listItems = ul.getElementsByTagName("li");
    const display = document.getElementById("display");

    var totalCredits = 0;
    var courseSelected = [];

    const selectedContainer = document.getElementById("selected_list");
    console.log(selectedContainer);

    var button = document.getElementById("select_button");

    for (let li of listItems) {
      li.addEventListener("click", function (event) {
        if (this.classList.contains("active")) {
          this.classList.remove("active");
          totalCredits -= Number(li.getAttribute("data-value"));
          display.innerHTML = totalCredits;
          courseSelected = courseSelected.filter((item) => item.id != li.id);
        } else {
          this.classList.add("active");
          totalCredits += Number(li.getAttribute("data-value"));
          display.innerHTML = totalCredits;
          courseSelected.push(li);
        }
        if (totalCredits > 18) {
          alert("You can only choose up to 18 credits in one semester");
        }
      });
    }

    button.addEventListener("click", function () {
      let temp = window.confirm(
        "You have chosen " +
          totalCredits +
          " credits for this semester. You cannot change once you submit. Do you want to confirm?"
      );

      if (temp) {
        for (let course of courseSelected) {
          course.style.display = "none";

          course.style.display = "";
          course.classList.remove("active");
          selectedContainer.appendChild(course);
        }
        button.disabled = true;
      }
    });
  };

  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  return {
    domstr,
    createTmp,
    activateSelection,
    render,
  };
})();

// MODEL
const Model = ((api, view) => {
  const { getCourses } = api;

  class State {
    #courseList = [];

    get courseList() {
      return this.#courseList;
    }

    set courseList(newCourseList) {
      this.#courseList = newCourseList;
      const courseContainer = document.querySelector(view.domstr.courseList);

      const tmp = view.createTmp(this.#courseList);

      view.render(courseContainer, tmp);
    }

    selectCourses() {
      view.activateSelection();
    }
  }

  return {
    getCourses,
    State,
  };
})(Api, View);

const controller = ((model, view) => {
  const state = new model.State();

  const init = () => {
    model.getCourses().then((courses) => {
      console.log(courses);
      state.courseList = courses;
      state.selectCourses();
    });
  };

  const bootstrap = () => {
    init();
  };

  return { bootstrap };
})(Model, View);
controller.bootstrap();
