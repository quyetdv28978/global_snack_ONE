import { defineStore } from 'pinia';
import axios from '@/service/Authentication/http.js';

const apiLoai = `${import.meta.env.VITE_BASE_API_ENDPOINT}/admin/loai`;

export const useLoaiService = defineStore('loai', {
    state: () => ({
        data: [],
        dataByStatus1: [],
        //nếu đang ở load tất cả thì là 0
        check: 0
    }),
    actions: {
        
        //load tất cả data
        async fetchData() {
            this.check = 0;
            try {
                const response = await axios.get(apiLoai);
                this.data = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        //load data size theo trạng thái
        async fetchDataByStatus(status) {
            this.check = 1;
            try {
                const response = await axios.get(apiLoai + '/trang-thai?trangThai=' + status);
                if (status === 1) {
                    this.dataByStatus1 = response.data.data;
                }
                this.data = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        createLoai(form) {
            axios.post(apiLoai + '/add', form).then((response) => {
                if (this.check == 0) {
                    // console.log(this.dataByStatus1);
                    this.data.unshift(response.data.data);
                    // console.log(this.data);

                    if (response.data.data.trangThai == 1) this.dataByStatus1.unshift(response.data.data);
                } else {
                    if (this.data[0].trangThai == response.data.data.trangThai) this.data.unshift(response.data.data);
                    if (response.data.data.trangThai == 1) this.dataByStatus1.unshift(response.data.data);
                }
            });
        },
        updateLoai(id, form) {
            axios.put(apiLoai + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].ten = form.ten;
                        this.data[i].moTa = form.moTa;
                    }
                }
                for (let i = 0; i < this.dataByStatus1.length; i++) {
                    if (id == this.dataByStatus1[i].id) {
                        this.dataByStatus1[i].ten = form.ten;
                        this.dataByStatus1[i].moTa = form.moTa;
                    }
                }
            });
        },
        deleteLoai(id) {
            axios.put(apiLoai + '/delete/' + id).then((response) => {
                if (this.check == 0) {
                    for (let i = 0; i < this.data.length; i++) {
                        if (id == this.data[i].id) {
                            this.data[i].trangThai = 0;
                        }
                    }
                    let index = -1;
                    for (let i = 0; i < this.dataByStatus1.length; i++) {
                        if (id == this.dataByStatus1[i].id) {
                            index = i;
                        }
                    }
                    this.dataByStatus1.splice(index, 1);
                } else {
                    if (this.data[0].trangThai != response.data.data.trangThai) {
                        let index = -1;
                        for (let i = 0; i < this.data.length; i++) {
                            if (id == this.data[i].id) {
                                index = i;
                            }
                        }
                        this.data.splice(index, 1);
                        let index2 = -1;
                        for (let i = 0; i < this.dataByStatus1.length; i++) {
                            if (id == this.dataByStatus1[i].id) {
                                index2 = i;
                            }
                        }
                        this.dataByStatus1.splice(index2, 1);
                    }
                }
            });
        }
    }
});

// export const useUserStore = defineStore({
//     id: 'user',
//     state: () => ({
//         data: []
//     }),
//     actions: {
//         async fetchData() {
//             try {
//                 const response = await axios.get(apiSize);
//                 this.data = response.data;
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         }
//         // Thêm các hàm khác để thực hiện các thao tác CRUD
//     }
// });

// export default class SizeService {
//     useUserStore = defineStore('counter',{
//         id: 'user',
//         state: () => ({
//             data: [],
//             mess: 'hiiiiiiiii'
//         }),
//         actions: {
//             async fetchData() {
//                 try {
//                     const response = await axios.get(apiSize);
//                     this.data = response.data;
//                 } catch (error) {
//                     console.error('Error fetching users:', error);
//                 }
//             }
//             // Thêm các hàm khác để thực hiện các thao tác CRUD
//         }
//     });
// }

// //load data size tất cả
// const fetchData = async () => {
//     const response = await axios.get(apiSize);
//     return response.data.data;
// };

// //load data size theo trạng thái
// const fetchDataByStatus = async (status) => {
//     const response = await axios.get(apiSize + '/trang-thai?trangThai=' + status);
//     return response.data.data;
// };

// //add
// const createSize = (form) => {
//     const response = axios.post('http://localhost:8080/api/size/add', form);
//     fetchData();
// };

// export default {
//     fetchData,
//     fetchDataByStatus,
//     createSize
// };
