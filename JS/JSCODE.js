const time_now = document.getElementById("time_Now");
const shift = document.getElementById("shift");
const DataFill = document.getElementById("DataFill");
const ptname = document.getElementById("ptname");
const ptid = document.getElementById("ptid");
const register_test = document.getElementById("register_test");
const chkbox = document.querySelectorAll(`.tests input[type='checkbox'] `);
const searchValue = document.getElementById("searchinput");
const news = document.getElementById("news");
const msg = document.getElementById("msg");
let containerBox = "";

GetStoredData();
// *Get Time
setInterval(() => {
  const time = new Date();
  const hours = time.getHours();
  const minute = time.getMinutes().toString().padStart(2, "0");
  const sec = time.getSeconds().toString().padStart(2, "0");
  const hrs = hours % 12 || 12;
  const PmAm = hours >= 12 ? "PM" : "AM";

  time_now.style.color = "black";
  time_now.textContent = `${hrs} : ${minute} : ${sec} ${PmAm}`;

  //   ^adding Shift
  if (PmAm === "AM" && hrs >= 0 && hrs < 8) {
    shift.innerHTML = "الورديه الليله";
    shift.style.color = "white";
  } else if (PmAm === "AM" && hrs >= 8) {
    shift.innerHTML = "الورديه الصباحي تحت رعايه الحمله";
    shift.style.color = "white";
  } else if (PmAm === "PM" && hrs < 4) {
    shift.innerHTML = "الورديه الصباحي تحت رعايه الحمله";
    shift.style.color = "white";
  } else if (PmAm === "PM" && hrs >= 4) {
    shift.innerHTML = "الورديه المسائيه تحت رعايه المذيع";
    shift.style.color = "white";
  }
}, 1000);

function register() {
  let info_to_Save = [];
  let tests = [];
  // *check empty Field

  let Check_State = Array.from(chkbox).some((box) => box.checked);

  if (!(ptid.value == "" || ptname.value == "" || Check_State == false)) {
    //&add new
    const FullName = ptname.value;
    const id = +ptid.value;
    if (!ptid.value.trim() || isNaN(ptid.value.trim())) {
      alert("ادخل رقم المريض بطريقه صحيحه");
      return;
    }
    chkbox.forEach((box) => {
      if (box.checked) {
        tests.push(box.value);
      }
    });
    const time = time_now.textContent;
    info_to_Save.push({ id, FullName, tests, time });
    oldData = JSON.parse(localStorage.getItem("data")) || [];
    oldData.push(info_to_Save);
    localStorage.setItem("data", JSON.stringify(oldData));
    news.classList.remove("hide");
    // news.classList.add('show');
    setTimeout(() => {
      // news.classList.remove('show');

      news.classList.add("hide");
    }, 2000);

    GetStoredData();
    resetForm();
    return;
  } else {
    window.alert("ادخل البيانات كامله");
  }
}

function GetStoredData() {
  const StoredData = JSON.parse(localStorage.getItem("data")) || [];
  containerBox = ""; // Reset the content
  StoredData.map((patient) => {
    containerBox += `
       <tr>
               <th scope="row">✔</th>
              <td>${patient[0].id}</td>
              <td>${patient[0].FullName}</td>
              <td>${patient[0].tests}</td>
              <td>${patient[0].time}</td>
              <td><button class="btn btn-danger" onclick="editinfo(${patient[0].id})">تعديل</button></td>
              <td><button class="btn btn-primary" onclick="deleteinfo(${patient[0].id})">حذف</button></td>
       </tr>`;
  });
  DataFill.innerHTML = containerBox;
}

function editinfo(id) {
  const StoredData = JSON.parse(localStorage.getItem("data")) || [];

  const findData = StoredData.find((record) => record[0].id == id);
  ptid.value = findData[0].id;
  ptname.value = findData[0].FullName;
  deleteinfo(id);
  GetStoredData();

  msg.textContent = "تم التعديل بنجاح";
  news.classList.remove("hide");
  // news.classList.add('show');
  setTimeout(() => {
    // news.classList.remove('show');

    news.classList.add("hide");
  }, 2000);
}

function deleteinfo(toDel) {
  const StoredData = JSON.parse(localStorage.getItem("data")) || [];

  let newData = StoredData.filter((record) => record[0].id != toDel);
  localStorage.setItem("data", JSON.stringify(newData));
  GetStoredData();
}

function findPateint() {
  if (!(searchValue.value == "")) {
    let SearchBox = "";
    console.log("pingo");
    const StoredData = JSON.parse(localStorage.getItem("data")) || [];
    const result = StoredData.filter(
      (record) =>
        record[0].id === +searchValue.value ||
        record[0].FullName === searchValue.value
    );
    if (result.length === 0) {
      DataFill.innerHTML = `<tr><td colspan="5">لا يوجد مريض مسجل بتلك البيانات</td></tr>`;
      return;
    }
    console.log(result);

    SearchBox = `
           <tr >
                   <th scope="row">✔</th>
                  <td>${result[0][0].id}</td>
                  <td>${result[0][0].FullName}</td>
                  <td>${result[0][0].tests}</td>
                  <td>${result[0][0].time}</td>
                 
                  <td><button class="btn btn-danger" onclick="editinfo(${result[0][0].id})">تعديل</button></td>
                  <td><button class="btn btn-primary" onclick="deleteinfo(${result[0][0].id})">حذف</button></td>
           </tr>`;

    DataFill.innerHTML = SearchBox;
  } else {
    GetStoredData();
  }
}

function resetForm() {
  ptid.value = "";
  ptname.value = "";
  chkbox.forEach((box) => (box.checked = false));
}
