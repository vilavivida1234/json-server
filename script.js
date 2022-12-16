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
    selectedList: ".selected_list",
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
    var ul = document.getElementById("courses_list");
    var listItems = ul.getElementsByTagName("li");
    var display = document.getElementById("display");
    let totalCredits = 0;

    for (let li of listItems) {
      console.log(li);
      li.addEventListener("click", function () {
        if (totalCredits > 18) {
          alert("You can only choose up to 18 credits in one semester");
        }
        if (this.classList.contains("active")) {
          this.classList.remove("active");
          totalCredits -= Number(li.getAttribute("data-value"));
          display.innerHTML = totalCredits;
        } else {
          this.classList.add("active");
          totalCredits += Number(li.getAttribute("data-value"));
          display.innerHTML = totalCredits;
        }
      });
    }
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

  const select = () => {
    state.selectCourses();
  };

  const bootstrap = () => {
    init();
    select();
  };

  return { bootstrap };
})(Model, View);
controller.bootstrap();
