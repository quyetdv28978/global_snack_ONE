
import { defineStore } from 'pinia';
import axios from '@/service/Authentication/http.js';
import { log } from 'pdfmake/build/pdfmake';

const apiKhuyenMai = `${import.meta.env.VITE_BASE_API_ENDPOINT}/admin/khuyenMai`;

export const khuyenMaiStore = defineStore('khuyenmai', {
    state: () => ({
        data: [],
        excels:[],
        dataLoSanPham:[]
    }),
    actions: {

        async uploadFile(formData) {
            const response = await axios.post(apiKhuyenMai+"/view-data", formData);
            const newProductData = response.data;
            this.excels = newProductData; 
        },
        async getKhuyenMai() {
            try {
                const response = await axios.get(apiKhuyenMai + '/getAll');
                this.data = response.data;
            } catch (error) {
            }
        },
        async getKhuyenMaiApSanPhamLoSp(idkm) {
            try {
                const response = await axios.get(apiKhuyenMai + `/ap-khuyen-mai/${idkm}`);
                this.dataLoSanPham = response.data;
                console.log(this.data, " data khuyen mai ap lo san pham");
            } catch (error) {
            }
        },
        createKhuyenMai(form) {
            console.log(this.data);
            axios.post(apiKhuyenMai + '/add', form).then((response) => {
                console.log("data khuyen mai, ", response.data.data);
                this.data.unshift(response.data.data);
                console.log("data khuyen mai sau add: ", this.data);
            });
        },
        updateKhuyenMai(form, id) {
            axios.put(apiKhuyenMai + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].ten = form.ten;
                        this.data[i].thoiGianBatDau = form.thoiGianBatDau;
                        this.data[i].thoiGianKetThuc = form.thoiGianKetThuc;
                        this.data[i].moTa = form.moTa;
                        this.data[i].giaTriGiam = form.giaTriGiam;
                        this.data[i].trangThai = response.data.data.trangThai;
                    }
                }
            });
        },
        deleteKhuyenMai(form, id) {
            axios.put(apiKhuyenMai + '/delete/' + id, form).then((response) => {
                if (this.data[0].trangThai != response.data.data.trangThai) {
                    let index = -1;
                    for (let i = 0; i < this.data.length; i++) {
                        if (id == this.data[i].id) {
                            index = i;
                        }
                    }
                    this.data.splice(index, 1);
                }
            });
        },
       
        async getProduct() {
            try {
                const response = await axios.get(apiKhuyenMai + '/getAllCTSPByKhuyenMai');
                this.data = response.data;
            } catch (error) {
           
            }
        },

        updateCTSP(idctsp, idkm) {
            axios.put(`${import.meta.env.VITE_BASE_API_ENDPOINT}/admin/khuyenMai/applyKM/${idctsp}?idkm=${idkm}`).then((response) => {
                let index = -1;
                for (let i = 0; i < this.data.length; i++) {
                    if (idctsp == this.data[i].id) {
                        index = i;
                    }
                }
                this.data.splice(index, 1);
            });
        }
    }
});

