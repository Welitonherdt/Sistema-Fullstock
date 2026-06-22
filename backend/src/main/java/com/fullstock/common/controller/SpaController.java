package com.fullstock.common.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
        "/",
        "/login",
        "/users",
        "/locations",
        "/products",
        "/movements",
        "/inventory",
        "/reports"
    })
    public String index() {
        return "forward:/index.html";
    }
}
