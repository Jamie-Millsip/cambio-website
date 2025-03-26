package com.github.jamie_millsip.backend.model.DTO.request;

import com.fasterxml.jackson.annotation.JsonCreator;

public class nicknameInputRequest {

    private String nickname;


    @JsonCreator
    public nicknameInputRequest(String nickname) {
        this.nickname = nickname;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
