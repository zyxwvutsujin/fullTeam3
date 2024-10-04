package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<MeausreProProject, String> {
    // 공사현장 검색
    @Query("SELECT p FROM MeausreProProject  p WHERE p.manager.id = :id AND p.siteName LIKE %:siteName%")
    List<MeausreProProject> searchSite(String id, String siteName);
}
